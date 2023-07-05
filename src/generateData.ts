import {PrismaClient} from '@prisma/client'
import bcrypt from 'bcrypt'
const prisma = new PrismaClient()

async function generateDept(){
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
        await prisma.department.create({
            data : {
                name : depts[i],
                shortName : deptShorts[i],
                deptCode : deptCodes[i]
            }
        })
    }
    // prisma.batch.createMany({
    //     data : 
    // })
}

async function generateBatches(){
    let batches = [
        '2018',
        '2019',
        '2020',
        '2021'
    ]

    let n = batches.length
    batches.forEach(async (batch, index)=>{
        await prisma.batch.create({
            data : {
                year : batch
            }
        })
    })
}
async function generateLT(){
    let levelTerm = [
        '4-1',
        '3-2',
        '2-2',
        '1-2'
    ]

    let n = levelTerm.length
    levelTerm.forEach(async (lt, index)=>{
        await prisma.levelTerm.create({
            data : {
                label : lt
            }
        })
    })
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
                    roomCapacity : i % 2 ? 3 : 4,
                    roomNo : i,
                    floorId : f.floorId
                }
            }))
        }
    })
    await Promise.all(promises)
}

async function generateResidency(){
    let students = await prisma.student.findMany()
    let rooms = await prisma.room.findMany()
    let randIndex = () =>{
        return Math.floor(Math.random() * rooms.length ) 
    }

    let promises = []
    students.forEach( async st =>{
        
        if (st.residencyStatus == 'RESIDENT'){
            console.log('here');
            let room = rooms[randIndex()]

            while(true){
                room = rooms[randIndex()]
                let residents = await prisma.residency.findMany({
                    where : {
                        roomId : room.roomId
                    }
                })
                if(residents.length < room.roomCapacity )
                    break;
            }

            // promises.push(
                prisma.residency.create({
                    data : {
                        from : new Date(Date.now() - 1000 * 60 * 24 * 30),
                        roomId : room.roomId,
                        studentId : st.studentId
                    }
                }).then(r =>{
                    console.log(r);
                })
                .catch(err =>{
                    console.log(err)
                })
            // )
        }
    })
    try{

        await Promise.all(promises)
    }
    catch(err){
        console.log(err)
    }

}

// async function generate


// generateBatches()
// generateDept()
// generateLT()
// generateStudents()
// generateFloors()
// generateRooms()
// generateResidency()
 
async function generateAll(){
    // await generateBatches()
    // await generateDept()
    // await generateLT()
    await generateStudents()
    await generateFloors()
    await generateRooms()
    await generateResidency()
}

generateAll();

// async function generateRooms(){
//     let floor
// }