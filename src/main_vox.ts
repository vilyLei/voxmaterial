
// import {DemoBase as Demo} from "./demo/DemoBase";
import {DemoShaderMaterial as Demo} from "./demo/shaderExample/DemoShaderMaterial";

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