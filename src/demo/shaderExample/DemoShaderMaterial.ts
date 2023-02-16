import IRendererScene from "../../vox/scene/IRendererScene";
import { IMouseInteraction } from "../../cospace/voxengine/ui/IMouseInteraction";
import IRenderTexture from "../../vox/render/texture/IRenderTexture";
import { CoEntityLayouter } from "../../cospace/app/common/CoEntityLayouter";
import { CoGeomDataType, CoDataFormat, CoGeomModelLoader } from "../../cospace/app/common/CoGeomModelLoader";
import { RendererDevice, VoxRScene } from "../../cospace/voxengine/VoxRScene";
import { VoxMaterial } from "../../cospace/voxmaterial/VoxMaterial";
import { VoxUIInteraction } from "../../cospace/voxengine/ui/VoxUIInteraction";

import { ShaderCode } from "./ShaderCode";
import VoxRuntime from "../../common/VoxRuntime";

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

	protected createEntity(model: CoGeomDataType, transform: Float32Array = null, index: number = 0): void {
		if (model != null) {

			let material = VoxMaterial.createShaderMaterial("model_shd");
			material.setFragShaderCode(ShaderCode.frag_body);
			material.setVtxShaderCode(ShaderCode.vert_body);
			material.addUniformDataAt("u_color", new Float32Array([1.0, 1.0, 1.0, 1.0]));
			material.setTextureList([
				this.getTexByUrl("static/assets/metal_01.png")
			]);

			let matrix4 = VoxRScene.createMat4(transform);
			let entity = VoxRScene.createDisplayEntityFromModel(model, material);
			entity.getTransform().setParentMatrix(matrix4);
			this.m_rscene.addEntity(entity);

			this.m_layouter.layoutAppendItem(entity, matrix4);
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
		url = baseUrl + "obj/apple_01.obj";

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
