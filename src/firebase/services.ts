import { addDoc, serverTimestamp, collection } from 'firebase/firestore';
import { db } from './config';

export const addDocument = async (collectionName: any, data: any) => {
    const dbRef = collection(db, collectionName);

    await addDoc(dbRef, {
        ...data,
        createdAt: serverTimestamp(),
    });
};

export const generateKeywords = (displayName: string) => {
    const name = displayName.split(' ').filter((word) => word);

    const length = name.length;
    const flagArray: boolean[] = [];
    const result: any[] = [];
    const stringArray: string[] = [];

    for (let i = 0; i < length; i++) {
        flagArray[i] = false;
    }

    const createKeywords = (name: string) => {
        const arrName: string[] = [];
        let curName = '';
        name.split('').forEach((letter) => {
            curName += letter;
            arrName.push(curName);
        });
        return arrName;
    };

    function findPermutation(k: number) {
        for (let i = 0; i < length; i++) {
            if (!flagArray[i]) {
                flagArray[i] = true;
                result[k] = name[i];

                if (k === length - 1) {
                    stringArray.push(result.join(' '));
                }

                findPermutation(k + 1);
                flagArray[i] = false;
            }
        }
    }

    findPermutation(0);

    const keywords = stringArray.reduce((acc: any[], cur) => {
        const words = createKeywords(cur);
        return [...acc, ...words];
    }, []);

    return keywords;
};
