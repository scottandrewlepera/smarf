import exportedTypeSuite from '../types/index-ti';
import { createCheckers } from "ts-interface-checker";

const TypeChecker = createCheckers(exportedTypeSuite);

export function checkType(object: any, type: string) {
    if (!TypeChecker[type]) {
        throw new Error(`checkType: type ${type} is undefined.`);
    }
    try {
        TypeChecker[type].check(object);
    } catch (err) {
        console.error(`checkType: object does not validate as type ${type}.`);
        console.error(err);
    }
}

export default checkType;
