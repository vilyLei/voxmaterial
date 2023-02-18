/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IVector3D from "../../vox/math/IVector3D";
import IColor4 from "../../vox/material/IColor4";

export interface ISpotLight {

    readonly position: IVector3D;
    readonly direction: IVector3D;
    readonly color: IColor4;
    /**
     * spot light 椎体夹角角度值
     */
    angleDegree: number;
    /**
     * 顶点与点光源之间距离的一次方因子, default value is 0.0001
     */
    attenuationFactor1: number;
    /**
     * 顶点与点光源之间距离的二次方因子, default value is 0.0005
     */
    attenuationFactor2: number;


    setParams(px: number, py: number, pz: number, dx: number, dy: number, dz: number, r: number, g: number, b: number, degree: number, f1: number, f2: number): void;
}