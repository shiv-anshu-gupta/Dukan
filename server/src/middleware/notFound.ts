import type {Request, Response, NextFunction} from "express";
import {fail} from "../utils/envelope";


export function notFound(req:Request, res:Response, next:NextFunction){
    res.status(404).json(
        fail(`Route not found ${req.method}`)
    )
}