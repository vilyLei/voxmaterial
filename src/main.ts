
import {DemoBase as Demo} from "./demo/DemoBase";

document.title = "Vox Material";
let ins = new Demo()as any;
function main(): void {
    console.log("------ demo --- init ------");
    ins.initialize();
    if(ins.run) {
        function mainLoop(now: any): void {
            ins.run();
            window.requestAnimationFrame(mainLoop);
        }
        window.requestAnimationFrame(mainLoop);
    }
    console.log("------ demo --- running ------");
}
main();