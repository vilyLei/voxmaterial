import IRendererScene from "../../vox/scene/IRendererScene";
import IRenderTexture from "../../vox/render/texture/IRenderTexture";
import ITransformEntity from "../../vox/entity/ITransformEntity";

import { CoEntityLayouter } from "../../cospace/app/common/CoEntityLayouter";
import { CoGeomDataType, CoDataFormat, CoGeomModelLoader } from "../../cospace/app/common/CoGeomModelLoader";

import { VoxRScene } from "../../cospace/voxengine/VoxRScene";
import { VoxMaterial } from "../../cospace/voxmaterial/VoxMaterial";
import { VoxUIInteraction } from "../../cospace/voxengine/ui/VoxUIInteraction";
import IRendererSceneGraph from "../../vox/scene/IRendererSceneGraph";
import { IVoxUIScene } from "../../voxui/scene/IVoxUIScene";
import { CtrlInfo } from "../../voxui/panel/IParamCtrlPanel";
import { VoxMath } from "../../cospace/math/VoxMath";
import { VoxUI } from "../../voxui/VoxUI";

import { ShaderCode } from "./ShaderCode";
import VoxModuleShell from "../../common/VoxModuleShell";

export class DemoParamCtrl {

	private m_graph: IRendererSceneGraph = null;
	private m_rscene: IRendererScene = null;
	private m_modelLoader = new CoGeomModelLoader();
	private m_layouter = new CoEntityLayouter();
	private m_entities: ITransformEntity[] = [];
	constructor() { }

	initialize(): void {

		console.log("DemoParamCtrl::initialize()......");

		let rt = new VoxModuleShell();
		rt.initialize(
			(): void => { this.initUserInteract(); },
			(): void => { this.initRenderer(); },
			(): void => { this.initModel(); }
		);
	}
	private m_dataList: Float32Array[] = [];
	protected createEntity(model: CoGeomDataType, transform: Float32Array = null, index: number = 0): void {

		if (model != null) {

			console.log("createEntity(), model: ", model);

			let fs = new Float32Array([1.0, 1.0, 1.0, 1.0]);
			this.m_dataList.push(fs);

			let material = VoxMaterial.createShaderMaterial("model_shd");
			material.setFragShaderCode(ShaderCode.frag_body);
			material.setVertShaderCode(ShaderCode.vert_body);
			material.addUniformDataAt("u_color", fs);
			material.setTextureList([
				this.getTexByUrl("static/assets/metal_01.png")
			]);
			let entity = VoxRScene.createDisplayEntityFromModel(model, material);
			// entity.setRenderState(VoxRScene.RendererState.NONE_CULLFACE_NORMAL_STATE);
			this.m_entities.push(entity);
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

				this.initUI();
			});

		let baseUrl = "static/assets/";
		let url = baseUrl + "fbx/base4.fbx";
		url = baseUrl + "obj/apple.obj";
		// url = baseUrl + "fbx/mat_ball.fbx";

		this.loadModels([url]);
	}
	private loadModels(urls: string[], typeNS: string = ""): void {
		this.m_modelLoader.load(urls);
	}

	private initUI(): void {
		
		let uisc = VoxUI.createUIScene(this.m_graph);
		this.initUIObjs(uisc);
	}

	private initUIObjs(uisc: IVoxUIScene): void {

		let panel = VoxUI.createParamCtrlPanel();
		panel.initialize(uisc, 1);
		panel.setXY(10, 10);

		let sv = VoxMath.createVec3();
		let currSV = VoxMath.createVec3();

		let ls = this.m_entities;
		let entity0 = ls[0];
		let entity1 = ls.length > 1 ? ls[1] : ls[0];
		let dls = this.m_dataList;
		let fs0 = dls[0];
		let fs1 = dls.length > 1 ? dls[1] : dls[0];
		entity0.getScaleXYZ(sv);

		panel.setBGColor(VoxMaterial.createColor4(0.4, 0.4, 0.4));

		panel.addStatusItem("显示-A", "visible-a", "Yes", "No", true, (info: CtrlInfo): void => {
			// console.log("显示-A", info.flag);
			entity0.setVisible(info.flag);
		});
		panel.addStatusItem("显示-B", "visible-b", "Yes", "No", true, (info: CtrlInfo): void => {
			// console.log("显示-B", info.flag);
			entity1.setVisible(info.flag);
		});
		panel.addProgressItem("缩放-A", "scale", 1.0, (info: CtrlInfo): void => {
			// console.log("缩放-A", info.values[0]);
			currSV.copyFrom(sv);
			let s = info.values[0];
			console.log("xxx s: ", s);
			currSV.scaleBy(s);
			entity0.setScale3(currSV);
			entity0.update();
		});
		panel.addValueItem("Y轴移动-B", "move-b", 0, -300, 300, (info: CtrlInfo): void => {

			console.log("Y轴移动-B", info.values[0]);

			let pv = entity1.getPosition();
			pv.y = info.values[0];
			entity1.setPosition(pv);
			entity1.update();
		});
		panel.addValueItem("颜色-A", "color-a", 0.8, 0.0, 10, (info: CtrlInfo): void => {
			let values = info.values;
			console.log("颜色-A, color-a values: ", values, ", colorPick: ", info.colorPick);
			let fs = fs0;
			fs[0] = values[0]; fs[1] = values[1]; fs[2] = values[2];
		}, true);

		panel.addValueItem("颜色-B", "color-b", 0.6, 0.0, 2.0, (info: CtrlInfo): void => {
			let values = info.values;
			console.log("color-b, values: ", values, ", colorPick: ", info.colorPick);
			let fs = fs1;
			fs[0] = values[0]; fs[1] = values[1]; fs[2] = values[2];
		}, true);

		panel.open();
		panel.layoutItem();
	}
	isEngineEnabled(): boolean {
		return VoxRScene.isEnabled();
	}
	private initUserInteract(): void {

		let mi = VoxUIInteraction.createMouseInteraction();
		mi.initialize(this.m_rscene, 0, true);
		mi.setAutoRunning(true);
	}

	private getTexByUrl(url: string): IRenderTexture {
		let sc = this.m_rscene;

		let tex = sc.textureBlock.createImageTex2D();
		let img = new Image();
		img.onload = (): void => {
			tex.setDataFromImage(img);
		};
		img.src = url;
		return tex;
	}
	private initRenderer(): void {
		if (this.m_graph == null) {

			let RD = VoxRScene.RendererDevice;
			RD.SHADERCODE_TRACE_ENABLED = false;
			RD.VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;
			RD.SetWebBodyColor("#888888");

			let graph = this.m_graph = VoxRScene.createRendererSceneGraph();
			let rparam = graph.createRendererSceneParam();
			rparam.setAttriAntialias(!RD.IsMobileWeb());
			rparam.setCamPosition(1000.0, 1000.0, 1000.0);
			rparam.setCamProject(45, 20.0, 9000.0);
			this.m_rscene = graph.createScene(rparam, 3);
			this.m_rscene.setClearUint24Color(0x888888);
		}
	}
	run(): void {
		if (this.m_graph != null) {
			this.m_graph.run();
		}
	}
}

export default DemoParamCtrl;
