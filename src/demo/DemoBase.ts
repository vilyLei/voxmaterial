import IRendererScene from "../vox/scene/IRendererScene";
import VoxRuntime from "../common/VoxRuntime";
import { RendererDevice, VoxRScene } from "../cospace/voxengine/VoxRScene";
import { VoxUIInteraction } from "../cospace/voxengine/ui/VoxUIInteraction";

export class DemoBase {

    private m_rscene: IRendererScene = null;
    initialize(): void {
        console.log("DemoBase::initialize() ...");

        document.oncontextmenu = function (e) {
            e.preventDefault();
        }
        this.initSysModule();
    }

    private initSysModule(): void {
        new VoxRuntime().initialize(
            (): void => { this.initUserInteract(); },
            (): void => { this.initRenderer(); }
        );
    }

    private initUserInteract(): void {
        let mi = VoxUIInteraction.createMouseInteraction();
        mi.initialize(this.m_rscene, 0, true);
        mi.setAutoRunning(true);
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

            this.m_rscene.addEntity(VoxRScene.createAxis3DEntity());
        }
    }

    run(): void {
        if (this.m_rscene != null) {
            this.m_rscene.run();
        }
    }
}

export default DemoBase;