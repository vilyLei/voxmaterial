import IRendererScene from "../../vox/scene/IRendererScene";
import { IMouseInteraction } from "../../cospace/voxengine/ui/IMouseInteraction";
import IRenderTexture from "../../vox/render/texture/IRenderTexture";
import ITransformEntity from "../../vox/entity/ITransformEntity";
import IDataMesh from "../../vox/mesh/IDataMesh";

import IRenderMaterial from "../../vox/render/IRenderMaterial";
import { ShaderCode } from "./ShaderCode";
import { CoEntityLayouter } from "../../common/utils/CoEntityLayouter";
import { CoGeomDataType, CoDataFormat, CoGeomModelLoader } from "../../cospace/app/common/CoGeomModelLoader";
import VoxRuntime from "../../common/VoxRuntime";
import { VoxEntity } from "../../cospace/voxentity/VoxEntity";
import { VoxAGeom } from "../../cospace/ageom/VoxAgeom";
import { VoxMesh } from "../../cospace/voxmesh/VoxMesh";
import { RendererDevice, VoxRScene } from "../../cospace/voxengine/VoxRScene";
import { VoxMaterial } from "../../cospace/voxmaterial/VoxMaterial";
import { VoxUIInteraction } from "../../cospace/voxengine/ui/VoxUIInteraction";


export class DemoShaderMaterial {

	private m_rscene: IRendererScene = null;
	private m_mouseInteraction: IMouseInteraction = null;
	private m_modelLoader = new CoGeomModelLoader();
	private m_layouter = new CoEntityLayouter();
	constructor() { }

	initialize(): void {

		console.log("DemoShaderMaterial::initialize()......");
		let rt = new VoxRuntime();
		rt.initialize(
			(): void => { this.initUserInteract(); },
			(): void => { this.initRenderer(); },
			(): void => { this.initModel(); }
		);
	}

	private createMesh(model: CoGeomDataType, material: IRenderMaterial): IDataMesh {
		let vs = model.vertices;
		let uvs = model.uvsList[0];
		let ivs = model.indices;
		let nvs = model.normals;

		let mesh = VoxMesh.createDataMesh();
		mesh.vbWholeDataEnabled = false;
		mesh.setVS(vs);
		mesh.setUVS(uvs);
		mesh.setNVS(nvs);
		mesh.setIVS(ivs);
		mesh.setVtxBufRenderData(material);

		mesh.initialize();
		return mesh
	}
	private createEntityWithMaterial(material: IRenderMaterial, model: CoGeomDataType, transform: Float32Array = null): ITransformEntity {

		material.initializeByCodeBuf(true);

		let nvs = model.normals;
		if (nvs == null) {
			let vs = model.vertices;
			let ivs = model.indices;
			let trisNumber = ivs.length / 3;
			VoxAGeom.SurfaceNormal.ClacTrisNormal(vs, vs.length, trisNumber, ivs, nvs);
		}

		let mesh = this.createMesh(model, material);

		let matrix4 = VoxRScene.createMat4(transform);

		let entity = VoxEntity.createDisplayEntity();
		entity.setRenderState(VoxRScene.RendererState.NONE_CULLFACE_NORMAL_STATE);
		entity.setMesh(mesh);
		entity.setMaterial(material);
		entity.getTransform().setParentMatrix(matrix4);
		return entity;
	}
	protected createEntity(model: CoGeomDataType, transform: Float32Array = null, index: number = 0): void {
		if (model != null) {
			console.log("createEntity(), model: ", model);

			let material = VoxMaterial.createShaderMaterial("model_shd");
			material.setFragShaderCode(ShaderCode.frag_body);
			material.setVtxShaderCode(ShaderCode.vert_body);
			material.addUniformDataAt("u_color", new Float32Array([1.0, 1.0, 1.0, 1.0]));
			material.setTextureList([
				this.getTexByUrl("static/assets/metal_01.png")
			]);

			let entity = this.createEntityWithMaterial(material, model, transform);
			this.m_rscene.addEntity(entity);

			this.m_layouter.layoutAppendItem(entity, VoxRScene.createMat4(transform));
		}
	}
	private initModel(): void {

		this.m_modelLoader.setListener(
			(models: CoGeomDataType[], transforms: Float32Array[], format: CoDataFormat): void => {
				console.log("loaded some models.");
				for (let i = 0; i < models.length; ++i) {
					this.createEntity(models[i], transforms != null ? transforms[i] : null);
				}
			},
			(total): void => {
				console.log("loaded model all.");
				this.m_layouter.layoutUpdate();
			});

		let baseUrl = "static/private/";
		let url = baseUrl + "fbx/base4.fbx";
		// url = baseUrl + "fbx/hat_ok.fbx";
		url = baseUrl + "obj/apple_01.obj";
		// url = baseUrl + "ctm/errorNormal.ctm";

		this.loadModels([url]);
	}
	private loadModels(urls: string[], typeNS: string = ""): void {
		this.m_modelLoader.load(urls);
	}
	isEngineEnabled(): boolean {
		return VoxRScene.isEnabled();
	}
	private initUserInteract(): void {

		let r = this.m_rscene;
		if (r != null && this.m_mouseInteraction == null && VoxUIInteraction.isEnabled()) {

			this.m_mouseInteraction = VoxUIInteraction.createMouseInteraction();
			this.m_mouseInteraction.initialize(this.m_rscene, 0, true);
			this.m_mouseInteraction.setSyncLookAtEnabled(true);
		}
	}

	private getTexByUrl(url: string = ""): IRenderTexture {
		let sc = this.m_rscene;

		let tex = sc.textureBlock.createImageTex2D(64, 64, false);
		let img = new Image();
		img.onload = (evt: any): void => {
			tex.setDataFromImage(img, 0, 0, 0, false);
		};
		img.src = url;
		return tex;
	}
	private initRenderer(): void {

		if (this.m_rscene == null) {

			RendererDevice.SHADERCODE_TRACE_ENABLED = true;
			RendererDevice.VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;
			RendererDevice.SetWebBodyColor("black");

			let rparam = VoxRScene.createRendererSceneParam();
			rparam.setAttriAntialias(!RendererDevice.IsMobileWeb());
			rparam.setCamPosition(1000.0, 1000.0, 1000.0);
			rparam.setCamProject(45, 20.0, 9000.0);
			this.m_rscene = VoxRScene.createRendererScene(rparam, 3);

			// let axis = VoxRScene.createAxis3DEntity();
			// this.m_rscene.addEntity(axis);
		}
	}
	run(): void {
		if (this.m_rscene != null) {
			if (this.m_mouseInteraction != null) {
				this.m_mouseInteraction.setLookAtPosition(null);
				this.m_mouseInteraction.run();
			}
			this.m_rscene.run();
		}
	}
}

export default DemoShaderMaterial;
