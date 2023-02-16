import IRendererScene from "../vox/scene/IRendererScene";
import { IMouseInteraction } from "../cospace/voxengine/ui/IMouseInteraction";
import { IVoxUIScene } from "../voxui/scene/IVoxUIScene";

import VoxRuntime from "../common/VoxRuntime";
import { RendererDevice, VoxRScene } from "../cospace/voxengine/VoxRScene";
import { VoxUIInteraction } from "../cospace/voxengine/ui/VoxUIInteraction";
import { VoxMaterial } from "../cospace/voxmaterial/VoxMaterial";
import IRendererSceneGraph from "../vox/scene/IRendererSceneGraph";
import { VoxUI } from "../voxui/VoxUI";
import { VoxMath } from "../cospace/math/VoxMath";

export class DemoUIBase {

    private m_graph: IRendererSceneGraph = null;
    private m_rscene: IRendererScene = null;
	private m_interact: IMouseInteraction = null;

    initialize(): void {
        console.log("DemoUIBase::initialize() ...");
        
		document.oncontextmenu = function (e) {
			e.preventDefault();
		}
		this.initSysModule();
    }

    private initSysModule(): void {
        let rt = new VoxRuntime();
        rt.initialize(
            (): void => {
                this.initUserInteract();
            },
            (): void => {
                this.initRenderer();
                this.init3DScene();
            },
            (): void => {
				this.initUIScene();
				this.initUIObjs();
			}
        );
    }
	private m_uiScene: IVoxUIScene = null;
	private initUIScene(): void {
		let uisc = VoxUI.createUIScene(this.m_graph);
		console.log("create the VoxUIScene instance...");
		
		uisc.texAtlasNearestFilter = true;
		this.m_uiScene = uisc;
		uisc.initialize(this.m_graph, 512);
		console.log("uisc: ", uisc);
		console.log("uisc.rscene: ", uisc.rscene);	
	}
    private initUIObjs(): void {
        // this.test01();
        this.test02();
    }
	private test01(): void {
		console.log("test01()................");

		let uisc = this.m_uiScene;
		let texAtlas = uisc.texAtlas;
		let transparentTexAtlas = uisc.transparentTexAtlas;
		let urls: string[];
		let img: HTMLCanvasElement;

		let ta = texAtlas;
		let tta = transparentTexAtlas;
		let fontColor = VoxMaterial.createColor4(0,1,0,1);
		let bgColor = VoxMaterial.createColor4(1,1,1,0);
		urls = ["BBB-0", "BBB-1", "BBB-2", "BBB-3"];
		img = tta.createCharsCanvasFixSize(90, 40, urls[0], 30, fontColor,bgColor);
		tta.addImageToAtlas(urls[0], img);
		img = tta.createCharsCanvasFixSize(90, 40, urls[1], 30, fontColor,bgColor);
		tta.addImageToAtlas(urls[1], img);
		
		// let iconLable = new ClipLabel();
		let iconLable = VoxUI.createClipLabel();
		iconLable.transparent = true;
		iconLable.premultiplyAlpha = true;
		iconLable.initialize(tta, [urls[1]]);
		iconLable.setClipIndex(1);
		iconLable.setXY(500, 70);
		// iconLable.setScaleXY(1.5, 1.5);
		// iconLable.update();
		this.m_uiScene.addEntity(iconLable);
	}
	private test02(): void {
		console.log("testComp01()................");

		let uisc = this.m_uiScene;
		let texAtlas = uisc.texAtlas;
		let transparentTexAtlas = uisc.transparentTexAtlas;
		let urls: string[];
		let img: HTMLCanvasElement;

		let ta = texAtlas;
		let tta = transparentTexAtlas;
		
		///*
		// let colorLabel = new ColorLabel();
		// colorLabel.initialize(200, 130);
		// colorLabel.setXY(330, 400);
		// this.m_uiScene.addEntity(colorLabel, 1);

		let pw = 60;
		let ph = 30;
		let colorClipLabel2 = VoxUI.createClipColorLabel();
		colorClipLabel2.initializeWithoutTex(pw, ph, 4);
		// let colorClipLabel2 = new ColorClipLabel();
		// colorClipLabel2.initialize(csLable2, 4);
		// colorClipLabel2.getColorAt(0).setRGB3f(0.0, 0.8, 0.8);
		colorClipLabel2.getColorAt(0).setRGB3Bytes(40, 40, 40);
		colorClipLabel2.getColorAt(1).setRGB3f(0.2, 1.0, 0.2);
		colorClipLabel2.getColorAt(2).setRGB3f(0.2, 0.4, 1.0);
		colorClipLabel2.getColorAt(3).setRGB3f(0.2, 1.0, 0.2);
		// colorClipLabel2.setLabelClipIndex( 1 );
		// colorClipLabel.setXY(200,0);
		// colorClipLabel.setClipIndex(2);
		// this.m_uiScene.addEntity(colorClipLabel);
		// let colorBtn = CoUI.createButton(); //new Button();

		let fontColor = VoxMaterial.createColor4(1, 0, 0, 1);
		let bgColor = VoxMaterial.createColor4(1, 1, 1, 0);
		console.log("create file label...");
		urls = ["File", "Global", "Color", "BBB-3"];
		for(let i = 0; i < urls.length; ++i) {
			img = tta.createCharsCanvasFixSize(pw, ph, urls[i], 20, fontColor, bgColor);
			tta.addImageToAtlas(urls[i], img);
		}

		let iconLable = VoxUI.createClipLabel();
		iconLable.transparent = true;
		iconLable.premultiplyAlpha = true;
		iconLable.initialize(tta, [urls[1], urls[2]]);
		iconLable.setClipIndex(1);
		// iconLable.setXY(500, 70);
		// iconLable.setScaleXY(1.5, 1.5);
		// iconLable.update();
		// this.m_uiScene.addEntity(iconLable);
        
		let colorBtn2 = VoxUI.createButton();
		colorBtn2.syncLabelClip = false;
		colorBtn2.addLabel(iconLable);
		colorBtn2.initializeWithLable(colorClipLabel2);
		// colorBtn2.setXY(500, 600);
		let ipx = uisc.getRect().getRight() - 100;
		// console.log("XXXXX ipx: ", ipx);
		colorBtn2.setXY(ipx, 70);
		colorBtn2.update();
		
		let pv = VoxMath.createVec3();
		console.log("VoxMath.MathConst.MATH_1_OVER_PI: ",  VoxMath.MathConst.MATH_1_OVER_PI );
		console.log("XXXXX iconLable.getX(): ", iconLable.getX());
		iconLable.getPosition(pv);
		console.log("XXXXX iconLable A pv: ", pv);
		this.m_uiScene.addEntity(colorBtn2, 0);
		iconLable.getPosition(pv);
		console.log("XXXXX iconLable B pv: ", pv);

		// let layouter = uisc.layout.createLeftTopLayouter();
		let layouter = uisc.layout.createRightBottomLayouter();
		layouter.addUIEntity(colorBtn2);
		uisc.layout.addLayouter(layouter);
		uisc.updateLayout();
		//*/
	}
	private initUserInteract(): void {

		let r = this.m_rscene;
		if (r != null && this.m_interact == null && typeof VoxUIInteraction !== "undefined") {

			this.m_interact = VoxUIInteraction.createMouseInteraction();
			this.m_interact.initialize(this.m_rscene, 0, true);
			this.m_interact.setSyncLookAtEnabled(true);            
		}
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
    
	private init3DScene(): void {
        let axis = VoxRScene.createAxis3DEntity();
		this.m_rscene.addEntity(axis);
	}
    run(): void {
        if (this.m_graph != null) {
			if (this.m_interact != null) {
				this.m_interact.setLookAtPosition(null);
				this.m_interact.run();
			}
			this.m_graph.run();
		}
    }
}

export default DemoUIBase;