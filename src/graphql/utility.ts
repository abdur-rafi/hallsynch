import jwt from 'jsonwebtoken';
import { Identity } from './interface';
import { IncomingHttpHeaders } from 'http';
import { MealTime } from '@prisma/client';

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

export const roles = {
    PROVOST : 'provost',
    STUDENT : 'student',
    STUDENT_ATTACHED : 'student-attached',
    STUDENT_MESS_MANAGER : 'student-mess-manager',
    STUDENT_RESIDENT : 'student-resident'
}

export const params = {
    provostApplicationPerPageCount : 10,
    messApplicationPerPageCount : 5,
    studentPerPageCount : 10,
}

export const applicationTypes = {
    new : 'New Seat',
    temp : 'Temporary Seat',
    room : 'Room Change'
}

export const sortVals = {
    newest : 'Newest',
    oldest : 'Oldest'
}

export function getMealTime(v : string){
    if(v.toUpperCase() === 'DINNER')
        return MealTime.DINNER
    return MealTime.LUNCH
}

export function addDay(date : string){
    let dt = new Date(date)
    dt.setDate(dt.getDate() + 1)
    return dt;
}

export function addDays(date : string, days : number){
    let dt = new Date(date)
    dt.setDate(dt.getDate() + days)
    return dt;
}


export let ratingTypes = ['QUALITY', 'QUANTITY', 'MANAGEMENT']