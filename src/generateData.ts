import {PrismaClient, RatingType} from '@prisma/client'
import bcrypt from 'bcrypt'
import { addDay, addDays } from './graphql/utility'
const prisma = new PrismaClient()

async function generateDept(){
    let promises = []
    let deptShorts = [
        'CSE',
        'EEE',
        'ME',
        'CE'
    ]
    let depts = [
        'Computer Science and Engineering',
        'Electric and Electronics Engineering',
        'Mechanical Engineering',
        'Civil Engineering'
    ]

    let deptCodes = [
        '05',
        '03',
        '02',
        '01'
    ]
    let n = deptShorts.length

    for(let i = 0; i < n; ++i){
        promises.push(prisma.department.create({
            data : {
                name : depts[i],
                shortName : deptShorts[i],
                deptCode : deptCodes[i]
            }
        }))
    }
    await Promise.all(promises)
    // prisma.batch.createMany({
    //     data : 
    // })
}

async function generateBatches(){
    let promises = []
    let batches = [
        '2018',
        '2019',
        '2020',
        '2021'
    ]

    let n = batches.length
    batches.forEach(async (batch, index)=>{

        promises.push(prisma.batch.create({
            data : {
                year : batch
            }
        }))
    })

    await Promise.all(promises);
}
async function generateLT(){
    let promises = []
    let levelTerm = [
        '4-1',
        '3-2',
        '2-2',
        '1-2'
    ]

    let n = levelTerm.length
    levelTerm.forEach(async (lt, index)=>{
        promises.push(prisma.levelTerm.create({
            data : {
                label : lt
            }
        }))
    })

    await Promise.all(promises)
}


async function generateStudents(){

    let depts = await prisma.department.findMany();
    let batches = await prisma.batch.findMany();
    let lts = await prisma.levelTerm.findMany();
    let pass = 'password'
    let salt = await bcrypt.genSalt()
    let epass = await bcrypt.hash(pass, salt);
    let arr = []
    for(let i = 1; i < 31; ++i) arr.push(i)
    let promises = []
    depts.forEach(async (d , i) =>{

        batches.forEach(async (b, j)=>{
            arr.forEach(a =>{
                promises.push(prisma.student.create({
                    data : {
                        email : 'email@email.com',
                        name : 'firstName lastname',
                        phone : '123456',
                        residencyStatus : (Math.random() > .5 ? 'ATTACHED' : 'RESIDENT'),
                        student9DigitId : b.year + d.deptCode +  a.toString().padStart(3, '0'),
                        password : epass,
                        batchId : b.batchId,
                        departmentId : d.departmentId,
                        levelTermId : lts[j].levelTermId
                    }
                }))
            })
        })
    })

    await Promise.all(promises);

    // console.log(depts);
}


async function generateFloors(){
    let floors = [1, 2, 3, 4, 5]
    let charCount = [3, 3, 4, 4, 3]
    let promises = []


    floors.forEach((f, i)=>{
        promises.push(prisma.floor.create({
            data : {
                floorNo : f,
                roomLabelLen  : charCount[i]
            }
        }))
    })
    await Promise.all(promises)
}


async function generateRooms(){
    let floors = await prisma.floor.findMany()
    let promises = []

    floors.forEach(f =>{
        let roomCount = 15 + Math.floor(Math.random() * 10);
        for(let i = 1; i <= roomCount; ++i){
            promises.push(prisma.room.create({
                data : {
                    roomNo : i,
                    floorId : f.floorId
                }
            }))
        }
    })
    await Promise.all(promises);
}

async function generateSeat(){
    let rooms = await prisma.room.findMany();
    let promises = []
    let roomLabels = ['A', 'B', 'C', 'D']
    rooms.forEach(r =>{
        let rc = Math.random() > .5 ? 3 : 4;
        for(let i = 0; i < rc; ++i){
            promises.push(
                prisma.seat.create({
                    data : {
                        roomId : r.roomId,
                        seatLabel : roomLabels[i]
                    }
                })
            )
        }
    })
    await Promise.all(promises);
}

async function generateResidency(){
    let students = await prisma.student.findMany()
    let seats = await prisma.seat.findMany()
    let seatIndex = 0;

    let promises = []
    students.forEach( async st =>{

        if (st.residencyStatus == 'RESIDENT'){
            console.log('here');
            if(seatIndex >= seats.length - 10){
                promises.push(
                    prisma.student.update({
                        where : {
                            studentId : st.studentId
                        },
                        data : {
                            residencyStatus : 'ATTACHED'
                        }
                    })
                )
            }
            else{

                let seat = seats[seatIndex++]

                // while(true){
                //     seat = seats[randIndex()]
                //     let residents = await prisma.residency.findMany({
                //         where : {
                //             roomId : seat.roomId
                //         }
                //     })
                //     if(residents.length < seat.roomCapacity )
                //         break;
                // }

                promises.push(
                    prisma.residency.create({
                        data : {
                            from : new Date(Date.now() - 1000 * 60 * 24 * 30),
                            seatId : seat.seatId,
                            studentId : st.studentId
                        }
                    })
                )
            }
        }
    })
    try{

        await Promise.all(promises)
    }
    catch(err){
        console.log(err)
    }

}


async function generateTempResidencyHistory(){
    let students = await prisma.student.findMany();

    let seats = await prisma.seat.findMany()
    let seatIndex = 0;
    let counter = 0;

    let promises = []
    for (const st of students) {
        console.log(st.studentId);
        if(st.residencyStatus == 'RESIDENT') continue;
        if(seatIndex >= seats.length - 10){
            console.log('here');
        } else {
            counter++;
            if(counter > 10) break;
            const seat = seats[seatIndex++];
            const date = parseInt(Math.random().toString());
            promises.push(
                prisma.tempResidencyHistory.create({
                    data : {
                        from : new Date(Date.now() - date * 60 * 24 * 30),
                        studentId : st.studentId,
                        seatId : seat.seatId,
                        to : new Date(Date.now() - (date + 7) * 60 * 24 * 30)
                    }
                })
            )
        }
    }
    try{
        await Promise.all(promises)
    }
    catch(err){
        console.log(err)
    }
}

async function generateAuthority(){
    let pass = 'password'
    let salt = await bcrypt.genSalt()
    let epass = await bcrypt.hash(pass, salt);
    await prisma.authority.createMany({
        data : [
            {
                email : 'email1',
                name : 'authority',
                password : epass,
                role : 'PROVOST',
                phone : '1234567'
            },
            {
                email : 'email2',
                name : 'authority',
                password : epass,
                role : 'ASSISTANT_PROVOST',
                phone : '1234567'
            },
            {
                email : 'email3',
                name : 'authority',
                password : epass,
                role : 'DINING_STUFF',
                phone : '1234567'
            }
        ]
    })
}


async function generateApplications(){
    let promises = []
    let students = await prisma.student.findMany({
    })

    students.forEach(async s =>{
        if(s.residencyStatus == 'ATTACHED'){

            if(Math.random() > .5) return;

            promises.push(prisma.newApplication.create({
                data : {
                    application : {
                        create : {
                            status : 'PENDING',
                            studentId : s.studentId
                        }
                    },
                    questionnaire : {
                        create : {
                            q1 : Math.random() > .5,
                            q2 : Math.random() < .5
                        }
                    }
                }
            }))
        }
        // else if(s.residencyStatus == 'RESIDENT'){

        // }
    })

    await  Promise.all(promises);

}


async function generateItem(){
    let promises = []

    promises.push(
        prisma.item.create({
            data : {
                name : "Rice",
                type : "RICE"
            }
        })
    )

    promises.push(
        prisma.item.create({
            data : {
                name : "Alu Bhaji",
                type : "VEG"
            }
        })
    )

    promises.push(
        prisma.item.create({
            data : {
                name : "Chicken curry",
                type : "NON_VEG"
            }
        })
    )

    promises.push(
        prisma.item.create({
            data : {
                name : "Egg curry",
                type : "NON_VEG"
            }
        })
    )

    promises.push(
        prisma.item.create({
            data : {
                name : "Rui Fish",
                type : "NON_VEG"
            }
        })
    )


    promises.push(
        prisma.item.create({
            data : {
                name : "Polao",
                type : "RICE"
            }
        })
    )



    await Promise.all(promises);

}


async function generateMeal(){
    let promises = []

    let items = await prisma.item.findMany();
    let veg = items.filter(i => i.type == "VEG")
    let nonVeg = items.filter(i => i.type == "NON_VEG")
    let rice = items.filter(i => i.type == "RICE")

    promises.push(
        prisma.meal.create({
            data : {
                items : {
                    connect : [
                        {
                            itemId : veg[0].itemId
                        },
                        {
                            itemId : rice[0].itemId
                        },
                        {
                            itemId : nonVeg[0].itemId
                        },
                        {
                            itemId : nonVeg[1].itemId
                        }
                    ]
                }
            }
        })
    )
    promises.push(
        prisma.meal.create({
            data : {
                items : {
                    connect : [
                        {
                            itemId : veg[0].itemId
                        },
                        {
                            itemId : rice[0].itemId
                        },
                        {
                            itemId : nonVeg[1].itemId
                        },
                        {
                            itemId : nonVeg[2].itemId
                        },
                        {
                            itemId : nonVeg[0].itemId
                        },

                    ]
                }
            }
        })
    )

    promises.push(
        prisma.meal.create({
            data : {
                items : {
                    connect : [
                        {
                            itemId : veg[0].itemId
                        },
                        {
                            itemId : rice[1].itemId
                        },
                        {
                            itemId : nonVeg[1].itemId
                        },
                        {
                            itemId : nonVeg[2].itemId
                        }

                    ]
                }
            }
        })
    )

    await Promise.all(promises);

}

// async function generate


// generateBatches()
// generateDept()
// generateLT()
// generateStudents()
// generateFloors()
// generateRooms()
// generateResidency()

async function generateMealPlan(){
    let meals = await prisma.meal.findMany();
    let months = [6,7,8];
    let year = 2023;
    let promises = []

    // let messManagers = await prisma.messManager.findMany();
    // let randMessManagerId = ()=>{
    //     // return messManagers[0].messManagerId;
    //     return messManagers[Math.floor(Math.random() * messManagers.length)].messManagerId;
    // }
    months.forEach(async month =>{

        let mms = await prisma.messManager.findMany({
            where : {
                call : {
                    to : {
                        gte : new Date(year, month + 1, 1)
                    },
                    from : {
                        lte : new Date(year, month, 2)
                    }
                }
            }
        })
        console.log(mms);

        for(let j = 1; j < 32; ++j){
            promises.push(
                prisma.mealPlan.create({
                    data : {
                        day : new Date(year, month, j),
                        mealTime : "LUNCH",
                        mealId : meals[Math.floor(Math.random() * meals.length)].mealId,
                        messManagerId : mms[0].messManagerId
                    }
                }).catch(err =>{
                    console.log(err)
                })
            )
            promises.push(
                prisma.mealPlan.create({
                    data : {
                        day : new Date(year, month, j),
                        mealTime : "DINNER",
                        mealId : meals[Math.floor(Math.random() * meals.length)].mealId,
                        messManagerId : mms[0].messManagerId
                    }
                }).catch(err =>{
                    console.log(err)
                })
            )
        }
    })
    await Promise.all(promises).catch(err=>console.log(err) );

}

async function generateCupCount(){
    let promises = []
    let res = await prisma.mealPlan.findMany({
        include : {
            meal : {
                include : {
                    items : true
                }
            }
        }
    })
    res.forEach(mp =>{
        mp.meal.items.forEach(item =>{
            promises.push(
                prisma.cupCount.create({
                    data : {
                        cupcount : 50,
                        itemId : item.itemId,
                        mealPlanId : mp.mealPlanId
                    }
                })
            )
        })
    })
    await Promise.all(promises);
}


async function generateParticipation(){
    let promises = []

    let residents = await prisma.residency.findMany()
    let mealPlans = await prisma.mealPlan.findMany({
        where : {
            day : {
                lte : new Date()
            }
        }
    })

    residents.forEach(r =>{
        mealPlans.forEach(mp =>{
            if(Math.random() < .2){
                promises.push(
                    prisma.participation.create({
                        data : {
                            mealPlanId : mp.mealPlanId,
                            residencyId : r.residencyId
                        }
                    })
                )
            }
        })
    })
    await Promise.all(promises);

}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

async function generatePreference(){
    let promises = []

    let residents = await prisma.residency.findMany()
    let mealPlans = await prisma.mealPlan.findMany({
        include : {
            meal : {
                include : {
                    items : true
                }
            }
        }
    })

    residents.forEach(r =>{
        mealPlans.forEach(mp =>{
            if(Math.random() < .1){
                let vegs = mp.meal.items.filter(f => f.type == "VEG")
                let rice = mp.meal.items.filter(f => f.type == "RICE")
                let nonVeg = mp.meal.items.filter(f => f.type == "NON_VEG")
                shuffleArray(vegs)
                shuffleArray(rice)
                shuffleArray(nonVeg)
                let arr = [vegs, rice, nonVeg]
                arr.forEach(a =>{
                    promises.push(
                        prisma.preference.createMany({
                            data : a.map((it, index) =>({
                                itemId : it.itemId,
                                mealPlanId : mp.mealPlanId,
                                order : index,
                                residencyId : r.residencyId
                            }))
                        })
                    )
                })
                // arr.forEach(a =>{
                //     a.forEach((it, index)=>{
                //         promises.push(
                //             prisma.preference.create({
                //                 data : {
                //                     order : index,
                //                     itemId : it.itemId,
                //                     mealPlanId : mp.mealPlanId,
                //                     residencyId : r.residencyId
                //                 }
                //             })
                //         )
                //     })
                // })
            }
        })
    })
    await Promise.all(promises);
}

async function generateCall(){
    let months = [6,7,8,9]
    let promises = [];
    let auth = await prisma.authority.findFirst();
    months.forEach((m, i) =>{
        promises.push(
            prisma.messManagerApplicationCall.create({
                data : {
                    from : new Date(2023, m, 2),
                    to : new Date(2023, m + 1, 1),
                    // to : addDays(new Date(2023, m + 1, 1).toISOString(), - 1),
                    createdById : auth.authorityId
                }
            })
        )
    })
    await Promise.all(promises);

}

async function generateMessManager(){
    let residents = await prisma.residency.findMany();
    let promises = [];
    let calls = await prisma.messManagerApplicationCall.findMany();
    calls.forEach(c =>{
        residents.forEach(r =>{
            if(Math.random() < .03){
                promises.push(
                    prisma.messManager.create({
                        data : {
                            residencyId : r.residencyId,
                            callId : c.callId
                        }
                    })
                )
            }
        })
    })
    await Promise.all(promises);
}


async function generateOptedOut(){
    let promises = [];

    let residents = await prisma.residency.findMany();
    let mealPlans = await prisma.mealPlan.findMany();

    residents.forEach(f =>{
        promises.push(
            prisma.optedOut.createMany({
                data : mealPlans.filter(m => Math.random() > .8 ).map(d =>({
                    mealPlanId : d.mealPlanId,
                    residencyId : f.residencyId
                }))
            })
        )
    })


    await Promise.all(promises);
}

async function generateAnnouncements(){
    let promises = []
    let authorities = await prisma.authority.findMany();
    let messManagers = await prisma.messManager.findMany();

    authorities.forEach(a =>{
        const title = 'title_' + a.role.toLowerCase() + a.authorityId.toString();
        promises.push(
            prisma.announcement.create({
                data : {
                    authorityId : a.authorityId,
                    title : title,
                    details : 'lorem ipsum dolor sit amet by provost',
                    createdAt : new Date(Date.now() - 1000 * 60 * 60 * 24 * 30),
                }
            })
        )
    })

    messManagers.forEach(m =>{
        const title = 'title_mess_manager_' + m.messManagerId.toString();
        promises.push(
            prisma.announcement.create({
                data : {
                    messManagerId : m.messManagerId,
                    title : title,
                    details : 'lorem ipsum dolor sit amet by mess manager',
                    createdAt : new Date(Date.now() - 1000 * 60 * 60 * 24 * 30),
                }
            })
        )
    })

    await Promise.all(promises);
}

async function generateFeedback(){
    let promises = []

    // let messManager = await prisma.messManager.findMany();
    promises.push(prisma.mealPlan.findMany({
        where : {
            day : {
                lte : new Date()
            }
        },
        orderBy : [{
            day : 'asc',
        },{
            mealTime : 'desc'
        }]
    }).then(mealPlans =>{
        // console.log(mealPlans.length);
        let starts = [];
        let ends = []
        for(let i = 0; i + 14 < mealPlans.length; i+= 14){
            starts.push(mealPlans[i])
            ends.push(mealPlans[i + 13]);
        }
        console.log(starts, ends)
        promises.push(
            prisma.feedback.createMany({
                data : starts.map((s, i)=>({
                    startMealPlanId : s.mealPlanId,
                    endMealPlanId : ends[i].mealPlanId,
                    startDate : addDay(ends[i].day.toString())
                }))
            }).catch(err=>{
                console.log(err)
            })
        )
        console.log(mealPlans.length);

    }))
    // messManager.forEach(async m =>{


    //     // let mealPlans = await prisma.mealPlan.findMany({
    //     //     where : {
    //     //         messManagerId : m.messManagerId
    //     //     },
    //     //     orderBy : {
    //     //         mealPlanId : 'asc'
    //     //     }
    //     // })


    // })
    await Promise.all(promises);
}

async function generateRatings(){
    let promises = []
    let residents = await prisma.residency.findMany();
    let feedbacks = await prisma.feedback.findMany({
        orderBy : {
            startDate : "asc"
        }
    });
    feedbacks.pop();
    feedbacks.pop();
    // feedbacks.pop();

    console.log(feedbacks);

    let types = [RatingType.MANAGEMENT, RatingType.QUALITY, RatingType.QUANTITY]
    residents.forEach(r =>{
        feedbacks.forEach( async f =>{
            // console.log(f);
            let mealsCount = await prisma.participation.count({
                where : {
                    mealPlan : {
                        mealPlanId : {
                            gte : f.startMealPlanId,
                            lte : f.endMealPlanId
                        }
                    },
                    residencyId : r.residencyId
                }
            })
            // console.log(mealsCount)
                // console.log("here\n");
                // console.log(promises)
                promises.push(
                    prisma.rating.createMany({
                        data : types.map(t =>({
                            rating : Math.random() > .5 ? 4 : 5,
                            residencyId : r.residencyId,
                            type : t,
                            feedbackId : f.feedbackId
                        }))
                    }).catch(err=>{
                        console.log(err)
                    })
                )
                promises.push(
                    prisma.feedBackGiven.create({
                        data : {
                            feedBackId : f.feedbackId,
                            residencyId : r.residencyId,
                            comment : Math.random() > .5 ? null : "This is a comment"
                        }
                    }).catch(err=>{
                        console.log(err)
                    })
                )
            promises.push(mealsCount);

        })
    })
    await Promise.allSettled(promises);
}

async function generateMessManagerApplications(){
    let promises = []
    let residents = await prisma.residency.findMany();

    let calls = await prisma.messManagerApplicationCall.findMany();
    residents.forEach(r =>{
        calls.forEach(c =>{

            if(Math.random() < .03){
                promises.push(
                    prisma.messManagerApplication.create({
                        data : {
                            residencyId : r.residencyId,
                            status : 'PENDING',
                            appliedAt : new Date(Date.now() - 2000 * 60 * 60 * 24 * 30),
                            callId : c.callId
                        }
                    })
                )
            }
        })
    });

    await Promise.all(promises);
}

// generateComplaints function, generates complaints from july to december 2023


function busy(){
    for(let i = 0; i < 100000000; ++i){
        let j = 0;
        j += i;
    }
}

async function generateAll(){
    // await generateBatches()
    // await generateDept()
    // await generateLT()
    // await generateStudents()
    // await generateFloors()
    // await generateRooms()
    // await generateSeat()
    // await generateResidency()
    // await generateAuthority();
    // await generateApplications();
    // await generateTempResidencyHistory();
    // // //
    // // //
    // await generateCall();
    // await generateMessManagerApplications();
    // await generateMessManager();
    
    // await generateItem();
    // await generateMeal();
    // await generateMealPlan();

    // await generateCupCount();
    //
    // await generateParticipation();
    // await generatePreference();

    // await generateOptedOut();
    // //
    // await generateAnnouncements();
    // await generateFeedback();
    await generateRatings();
}

generateAll();
// busy();
setTimeout(()=>{
    console.log("Timeout");
}, 5000);

// async function generateRooms(){
//     let floor
// }