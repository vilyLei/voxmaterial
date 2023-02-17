import IRendererScene from "../vox/scene/IRendererScene";
import { IMouseInteraction } from "../cospace/voxengine/ui/IMouseInteraction";
import { VoxRScene } from "../cospace/voxengine/VoxRScene";
import { VoxUIInteraction } from "../cospace/voxengine/ui/VoxUIInteraction";
import VoxRuntime from "../common/VoxRuntime";

export class DemoMouseInteraction {

    private m_rscene: IRendererScene = null;
    private m_mouseInteract: IMouseInteraction = null;

    initialize(): void {
        document.oncontextmenu = function (e) {
            e.preventDefault();
        }
        this.initSysModule();
    }
    private initSysModule(): void {

        new VoxRuntime().initialize(
            (): void => {
                this.initMouseInteract();
            },
            (): void => {
                this.initRenderer();
                this.init3DScene();
            }
        );
    }
    private initMouseInteract(): void {

        this.m_mouseInteract = VoxUIInteraction.createMouseInteraction();
        this.m_mouseInteract.initialize(this.m_rscene, 0, true);
        this.m_mouseInteract.setSyncLookAtEnabled(true);
    }
    private initRenderer(): void {
        this.m_rscene = VoxRScene.createRendererScene();
        this.m_rscene.initialize(null);
    }
    private init3DScene(): void {
        this.m_rscene.addEntity(VoxRScene.createAxis3DEntity());
    }
    run(): void {
        if (this.m_rscene != null) {
            const mi = this.m_mouseInteract;
            if (mi != null) {
                mi.setLookAtPosition(null);
                mi.run();
            }
            this.m_rscene.run();
        }
    }
}

export default DemoMouseInteraction;