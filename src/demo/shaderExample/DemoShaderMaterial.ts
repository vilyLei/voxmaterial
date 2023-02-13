import IRendererScene from "../../vox/scene/IRendererScene";
import { IMouseInteraction } from "../../cospace/voxengine/ui/IMouseInteraction";
import { ICoRenderer } from "../../cospace/voxengine/ICoRenderer";
import { ICoRScene } from "../../cospace/voxengine/ICoRScene";
import { ICoMesh } from "../../cospace/voxmesh/ICoMesh";
import { ICoAGeom } from "../../cospace/ageom/ICoAGeom";
import { ICoMaterial } from "../../cospace/voxmaterial/ICoMaterial";
import { ICoEntity } from "../../cospace/voxentity/ICoEntity";

import { ICoUIInteraction } from "../../cospace/voxengine/ui/ICoUIInteraction";
import { ModuleLoader } from "../../common/loaders/ModuleLoader";
import IRenderTexture from "../../vox/render/texture/IRenderTexture";

import IRenderMaterial from "../../vox/render/IRenderMaterial";
import { ShaderCode } from "./ShaderCode";
import { CoEntityLayouter } from "../../common/utils/CoEntityLayouter";
import { CoGeomDataType, CoDataFormat, CoGeomModelLoader } from "../../common/loaders/CoGeomModelLoader";
import IDataMesh from "../../vox/mesh/IDataMesh";
import VoxRuntime from "../../common/VoxRuntime";
import ITransformEntity from "../../vox/entity/ITransformEntity";

declare var CoRenderer: ICoRenderer;
declare var CoRScene: ICoRScene;
declare var CoUIInteraction: ICoUIInteraction;
declare var CoMesh: ICoMesh;
declare var CoMaterial: ICoMaterial;
declare var CoEntity: ICoEntity;
declare var CoAGeom: ICoAGeom;

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

		let mesh = CoMesh.createDataMesh();
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
			CoAGeom.SurfaceNormal.ClacTrisNormal(vs, vs.length, trisNumber, ivs, nvs);
		}

		let mesh = this.createMesh(model, material);

		let matrix4 = CoRScene.createMat4(transform);
		let entity = CoEntity.createDisplayEntity();
		entity.setRenderState(CoRScene.RendererState.NONE_CULLFACE_NORMAL_STATE);
		entity.setMesh(mesh);
		entity.setMaterial(material);
		entity.getTransform().setParentMatrix(matrix4);
		return entity;
	}
	protected createEntity(model: CoGeomDataType, transform: Float32Array = null, index: number = 0): void {
		if (model != null) {
			console.log("createEntity(), model: ", model);

			let material = CoMaterial.createShaderMaterial("model_shd");
			material.setFragShaderCode(ShaderCode.frag_body);
			material.setVtxShaderCode(ShaderCode.vert_body);
			material.addUniformDataAt("u_color", new Float32Array([1.0, 1.0, 1.0, 1.0]));
			material.setTextureList([
				this.getTexByUrl("static/assets/metal_01.png")
			]);

			let entity = this.createEntityWithMaterial(material, model, transform);
			this.m_rscene.addEntity(entity);

			this.m_layouter.layoutAppendItem(entity, CoRScene.createMat4(transform));
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
		let url = baseUrl + "obj/base.obj";
		url = baseUrl + "fbx/base4.fbx";
		// url = baseUrl + "fbx/hat_ok.fbx";
		url = baseUrl + "obj/apple_01.obj";
		// url = baseUrl + "ctm/errorNormal.ctm";

		this.loadModels([url]);
	}
	private loadModels(urls: string[], typeNS: string = ""): void {
		this.m_modelLoader.load(urls);
	}
	isEngineEnabled(): boolean {
		return typeof CoRenderer !== "undefined" && typeof CoRScene !== "undefined";
	}
	private initUserInteract(): void {

		let r = this.m_rscene;
		if (r != null && this.m_mouseInteraction == null && typeof CoUIInteraction !== "undefined") {

			this.m_mouseInteraction = CoUIInteraction.createMouseInteraction();
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

			let RendererDevice = CoRenderer.RendererDevice;
			RendererDevice.SHADERCODE_TRACE_ENABLED = true;
			RendererDevice.VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;
			RendererDevice.SetWebBodyColor("black");

			let rparam = CoRScene.createRendererSceneParam();
			rparam.setAttriAntialias(!RendererDevice.IsMobileWeb());
			rparam.setCamPosition(1000.0, 1000.0, 1000.0);
			rparam.setCamProject(45, 20.0, 9000.0);
			this.m_rscene = CoRScene.createRendererScene(rparam, 3);

			// let axis = CoRScene.createAxis3DEntity();
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
