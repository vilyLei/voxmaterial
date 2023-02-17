import IRendererScene from "../vox/scene/IRendererScene";
import { VoxRScene } from "../cospace/voxengine/VoxRScene";
import VoxRuntime from "../common/VoxRuntime";

export class DemoEmptyRenderScene {

    private m_rscene: IRendererScene = null;
    initialize(): void {
        this.initSysModule();
    }
    private initSysModule(): void {
        
        new VoxRuntime().initialize(
            null,
            (): void => {
                this.initRenderer();
            }
        );
    }
    private initRenderer(): void {
        this.m_rscene = VoxRScene.createRendererScene();
        this.m_rscene.initialize(null);
    }
    run(): void {
        if(this.m_rscene) {
            this.m_rscene.run();
        }
    }
}
export default DemoEmptyRenderScene;