import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '~root/firebase/config';
import React from 'react';

// interface IDocument {
//     id: string;
//     name: string;
//     description: string;
//     members: string[];
// }

export const useFirestore = (collectionInput: any, condition: any) => {
    const [documents, setDocuments] = React.useState<any[]>([]);

    React.useLayoutEffect(() => {
        let queryCollection = query(collection(db, collectionInput));

        if (condition) {
            if (!condition.compareValue || !condition.compareValue.length) {
                return; // check null and empty array
            }

            queryCollection = query(
                collection(db, collectionInput),
                where(condition.fieldName, condition.operator, condition.compareValue),
            );
        }

        const unsubcribed = onSnapshot(queryCollection, (snapshot) => {
            const documents = snapshot.docs.map((doc) => ({
                ...doc.data(),
                id: doc.id,
            }));
            setDocuments(documents);
        });

        return () => {
            unsubcribed();
        };
    }, [collectionInput, condition]);

    return documents;
};
