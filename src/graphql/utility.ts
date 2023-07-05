import { Request } from 'express';
import jwt from 'jsonwebtoken';
import { Identity } from './interface';
import { IncomingHttpHeaders } from 'http';

function getTokenPayLoad(token : string){
    let t : null | Identity = null;
    try{
        t = jwt.verify(token, process.env.JWTSECRET) as Identity;
    }
    catch(err){
        
    }
    return t;
}


export function getIdentity(headers : IncomingHttpHeaders | null){
    let authString : string = ''
    if(headers){
        authString = headers.authorization;
    }
    else 
        return null;
        
    if(authString){
        const token = authString.replace('Bearer ', '');
        if(!token) return null;
        const t = getTokenPayLoad(token);
        if(!t){
            throw new Error('Unauthorized');
        }
        return t;
    }
    else return null;
}