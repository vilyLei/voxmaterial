import IRendererScene from "../vox/scene/IRendererScene";
import { VoxRScene } from "../cospace/voxengine/VoxRScene";
import { VoxUIInteraction } from "../cospace/voxengine/ui/VoxUIInteraction";
import { VoxEntity } from "../cospace/voxentity/VoxEntity";
import { VoxMaterial } from "../cospace/voxmaterial/VoxMaterial";
import { VoxMath } from "../cospace/math/VoxMath";
import IRenderTexture from "../vox/render/texture/IRenderTexture";
import VoxModuleShell from "../common/VoxModuleShell";

export class DemoPrimitives {

    private m_rscene: IRendererScene = null;
    constructor() { }

    initialize(): void {

        new VoxModuleShell().initialize(
            (): void => { this.initMouseInteract(); },
            (): void => { this.initRenderer(); },
            (): void => { this.init3DScene(); }
        );
    }
    private initMouseInteract(): void {

        const mi = VoxUIInteraction.createMouseInteraction();
        mi.initialize(this.m_rscene, 0, true);
        mi.setAutoRunning(true);
    }
    private initRenderer(): void {

        this.m_rscene = VoxRScene.createRendererScene();
        this.m_rscene.initialize(null);
        this.m_rscene.addEntity(VoxRScene.createAxis3DEntity());
    }

    private getTexByUrl(url: string): IRenderTexture {

        let tex = this.m_rscene.textureBlock.createImageTex2D(64, 64, false);
        let img = new Image();
        img.onload = (evt: any): void => {
            tex.setDataFromImage(img);
        };
        img.src = url;
        return tex;
    }
    private init3DScene(): void {

        let boxMaterial = VoxMaterial.createDefaultMaterial();
        boxMaterial.setRGB3f(0.7, 1.0, 1.0);
        boxMaterial.normalEnabled = true;

        let size = 50;
        let minPos = VoxMath.createVec3(-size, -size, -size);
        let maxPos = minPos.clone().scaleBy(-1.0);
        let box = VoxEntity.createBox(minPos, maxPos, boxMaterial);
        box.setXYZ(0, -200, 0);
        box.setScaleXYZ(10, 0.5, 10);
        this.m_rscene.addEntity(box);

        let cube = VoxEntity.createCube(200, boxMaterial);
        cube.setXYZ(-300, 0, 0);
        this.m_rscene.addEntity(cube);

        let sphMaterial = VoxMaterial.createDefaultMaterial();
        sphMaterial.normalEnabled = true;
        sphMaterial.setRGB3f(0.7, 1.0, 0.3);
        sphMaterial.setTextureList([this.getTexByUrl("static/assets/box.jpg")]);
        let sph = VoxEntity.createSphere(150, 20, 20, false, sphMaterial);
        sph.setXYZ(300, 0, 0);
        this.m_rscene.addEntity(sph);

        let coneMaterial = VoxMaterial.createDefaultMaterial();
        coneMaterial.normalEnabled = true;
        coneMaterial.setRGB3f(0.5, 0.8, 0.2);
        let cone = VoxEntity.createCone(100, 150, 20, -0.5, coneMaterial);
        cone.setXYZ(300, 0, -300);
        this.m_rscene.addEntity(cone);

        let planeMaterial = VoxMaterial.createDefaultMaterial();
        planeMaterial.normalEnabled = true;
        let plane = VoxEntity.createXOZPlane(-50, -50, 100, 100, coneMaterial);
        plane.setXYZ(-300, 0, 300);
        this.m_rscene.addEntity(plane);
    }
    run(): void {
        if (this.m_rscene != null) {
            this.m_rscene.run();
        }
    }
}

export default DemoPrimitives;