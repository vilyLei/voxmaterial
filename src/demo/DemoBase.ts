import IRendererScene from "../vox/scene/IRendererScene";
import { IMouseInteraction } from "../cospace/voxengine/ui/IMouseInteraction";
import VoxRuntime from "../common/VoxRuntime";
import { RendererDevice, VoxRScene } from "../cospace/voxengine/VoxRScene";
import { VoxUIInteraction } from "../cospace/voxengine/ui/VoxUIInteraction";

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
        if (r != null && this.m_interact == null && VoxUIInteraction.isEnabled()) {

            this.m_interact = VoxUIInteraction.createMouseInteraction();
            this.m_interact.initialize(this.m_rscene, 0, true);
            this.m_interact.setSyncLookAtEnabled(true);
        }
    }
    private initRenderer(): void {
        if (this.m_rscene == null) {
            
            RendererDevice.SHADERCODE_TRACE_ENABLED = false;
            RendererDevice.VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;
            RendererDevice.SetWebBodyColor("#888888");
            
            let rparam = VoxRScene.createRendererSceneParam();
            rparam.setAttriAntialias(!RendererDevice.IsMobileWeb());
            rparam.setCamPosition(1000.0, 1000.0, 1000.0);
            rparam.setCamProject(45, 20.0, 9000.0);
            this.m_rscene = VoxRScene.createRendererScene(rparam, 3);
            this.m_rscene.setClearUint24Color(0x888888);
        }
    }

    private init3DScene(): void {
        this.m_rscene.addEntity( VoxRScene.createAxis3DEntity() );
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