import IColor4 from "../../vox/material/IColor4";
import ICanvasTexAtlas from "../../cospace/voxtexture/atlas/ICanvasTexAtlas";
import { IClipEntity } from "./IClipEntity";

interface IClipColorLabel extends IClipEntity {

	initialize(atlas: ICanvasTexAtlas, idns: string, colorsTotal: number): void;
	initializeWithLable(srcLable: IClipColorLabel): void;
	initializeWithoutTex(width: number, height: number, colorsTotal: number): void;
	initializeWithSize(width: number, height: number, atlas: ICanvasTexAtlas, idns: string, colorsTotal: number): void;
	getColors(): IColor4[];
	getColorAt(i: number): IColor4;
	setColorAt(i: number, color4: IColor4): void;
	setColors(colors: IColor4[]): void;

}
export { IClipColorLabel };
