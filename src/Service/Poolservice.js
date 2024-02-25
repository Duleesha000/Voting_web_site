import { addDoc, arrayRemove, collection, deleteDoc, doc, getDoc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { firestore } from "../firebase"; // Import firestore from your Firebase configuration file

class PoolService {
  static async getAdminData(userId) {
    try {
      const adminDocRef = doc(firestore, 'Admins', userId);
      const adminDocSnapshot = await getDoc(adminDocRef);
      return adminDocSnapshot.data();
    } catch (error) {
      throw new Error('Error getting admin data from Firestore: ' + error.message);
    }
  }

  static async addPool(pool) {
    try {
      const plainPoolData = pool.toPlainObject(); // Convert Pool object to plain object
      await addDoc(collection(firestore, 'Pools'), plainPoolData);
    } catch (error) {
      throw new Error('Error adding pool to Firestore: ' + error.message);
    }
  }


  static async deletePool(poolId) {
    try {
      const poolRef = doc(firestore, 'Pools', poolId);
      const poolDoc = await getDoc(poolRef);

      if (!poolDoc.exists()) {
        throw new Error(`Pool with ID ${poolId} does not exist`);
      }

    

      // Delete the pool document
      await deleteDoc(poolRef);

      const competitorsCollection = collection(firestore, 'competitors');

      // Query competitors documents where poolid array contains the poolId
      const competitorsQuery = query(competitorsCollection, where('poolid', 'array-contains', poolId));
      const competitorsSnapshot = await getDocs(competitorsQuery);

      // Update each competitor document to remove the poolId from the poolid array
      const updatePromises = competitorsSnapshot.docs.map(async competitorDoc => {
        const competitorRef = doc(competitorsCollection, competitorDoc.id);
        await updateDoc(competitorRef, {
          poolid: arrayRemove(poolId)
        });
      });

      // Wait for all updates to complete
      await Promise.all(updatePromises);
    } catch (error) {
      throw new Error('Error deleting pool and updating competitors from Firestore: ' + error.message);
    }
  
  
  }

  static async updatePool(pool, id) {
    try {
      const updatedPoolData = pool.toPlainObject();
      // Ensure competitionLogo is defined before updating Firestore
      if (updatedPoolData.competitionLogo === undefined) {
        updatedPoolData.competitionLogo = ''; // Provide a default value if it's undefined
      }
      const poolRef = doc(firestore, 'Pools', id);
      await updateDoc(poolRef, updatedPoolData);
    } catch (error) {
      throw new Error('Error updating pool in Firestore: ' + error.message);
    }
  }


  

}

export default PoolService;
