
// import {DemoEmptyRenderScene as Demo} from "./demo/DemoEmptyRenderScene";
// import {DemoMouseInteraction as Demo} from "./demo/DemoMouseInteraction";
// import {DemoPrimitives as Demo} from "./demo/DemoPrimitives";

// import {DemoBase as Demo} from "./demo/DemoBase";
// import {DemoShaderMaterial as Demo} from "./demo/shaderExample/DemoShaderMaterial";
import {DemoUIBase as Demo} from "./demo/DemoUIBase";
// import {DemoParamCtrl as Demo} from "./demo/paramCtrl/DemoParamCtrl";

// import {DemoLoadModel as Demo} from "./demo/DemoLoadModel";

document.title = "Vox Material";
let ins = new Demo();
function main(): void {
    console.log("------ demo --- init ------");
    ins.initialize();
    function mainLoop(now: any): void {
        ins.run();
        window.requestAnimationFrame(mainLoop);
    }
    window.requestAnimationFrame(mainLoop);
    console.log("------ demo --- running ------");
}
main();