import { DataUtils } from "./DataUtils"
import { KeyUtils } from "./KeyUtils"

export interface IUserWithEmailAndUsername {
    email : string,
    fullName : string
}

interface IGuidedTourState {
    verificationCompleted : boolean
}

export class GuidedTourUtils {

    static guidedTourInstance : IGuidedTourState = {
        verificationCompleted : false
    }
    static isVerificationCompleted = () : Promise<boolean|null> => {
        return new Promise(async (resolve) => {
            const response  = await DataUtils.getData(KeyUtils.keys.verificationCompleted)
            if(response){
                const JsonResponse : IGuidedTourState = await JSON.parse(response)
                resolve(JsonResponse.verificationCompleted)
            }else{
                resolve(null)
            }
            
        })
    }
    static setVerificationCompleted = async() => {
        this.guidedTourInstance.verificationCompleted = true
        await DataUtils.setData(KeyUtils.keys.verificationCompleted , JSON.stringify(this.guidedTourInstance))
    }
}