import IRendererScene from "../vox/scene/IRendererScene";
import { ICoRScene } from "../cospace/voxengine/ICoRScene";
import { ICoUIInteraction } from "../cospace/voxengine/ui/ICoUIInteraction";
import { IMouseInteraction } from "../cospace/voxengine/ui/IMouseInteraction";
import VoxRuntime from "../common/VoxRuntime";

declare var CoRScene: ICoRScene;
declare var CoUIInteraction: ICoUIInteraction;

export class DemoBase {

    private m_rscene: IRendererScene = null;
    private m_interact: IMouseInteraction = null;

    initialize(): void {
        console.log("DemoBase::initialize() ...");

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
            }
        );
    }

    private initUserInteract(): void {

        let r = this.m_rscene;
        if (r != null && this.m_interact == null && typeof CoUIInteraction !== "undefined") {

            this.m_interact = CoUIInteraction.createMouseInteraction();
            this.m_interact.initialize(this.m_rscene, 0, true);
            this.m_interact.setSyncLookAtEnabled(true);
        }
    }
    private initRenderer(): void {
        if (this.m_rscene == null) {
            let RendererDevice = CoRScene.RendererDevice;
            RendererDevice.SHADERCODE_TRACE_ENABLED = false;
            RendererDevice.VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;
            RendererDevice.SetWebBodyColor("#888888");

            let rparam = CoRScene.createRendererSceneParam();
            rparam.setAttriAntialias(!RendererDevice.IsMobileWeb());
            rparam.setCamPosition(1000.0, 1000.0, 1000.0);
            rparam.setCamProject(45, 20.0, 9000.0);
            this.m_rscene = CoRScene.createRendererScene(rparam, 3);
            this.m_rscene.setClearUint24Color(0x888888);
        }
    }

    private init3DScene(): void {
        this.m_rscene.addEntity( CoRScene.createAxis3DEntity() );
    }
    run(): void {
        if (this.m_rscene != null) {
            if (this.m_interact != null) {
                this.m_interact.setLookAtPosition(null);
                this.m_interact.run();
            }
            this.m_rscene.run();
        }
    }
}

export default DemoBase;