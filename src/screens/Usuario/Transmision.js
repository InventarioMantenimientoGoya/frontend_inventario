import CryptoJS from 'crypto-js';
import { Buffer } from 'buffer';
import * as Crypto from 'expo-crypto'; // Usamos expo-crypto para random
import { claveCifrado } from '../../../constants';

class Transmision {
  // Genera un WordArray aleatorio usando expo-crypto
  static async generateRandomWordArray(byteLength) {
    const randomBytes = await Crypto.getRandomBytesAsync(byteLength);
    return CryptoJS.lib.WordArray.create(randomBytes);
  }

  // Deriva una clave usando PBKDF2
  static deriveKey(salt) {
    return CryptoJS.PBKDF2(claveCifrado, salt, {
      keySize: 256 / 32, // 256 bits
      iterations: 1000,
    });
  }

  // Encriptar datos
  static async encrypt(data) {
    try {
      const stringData = typeof data === 'string' ? data : JSON.stringify(data);

      const salt = await this.generateRandomWordArray(16); // 16 bytes
      const iv = await this.generateRandomWordArray(16);   // 16 bytes

      const key = this.deriveKey(salt);

      const encrypted = CryptoJS.AES.encrypt(stringData, key, {
        iv: iv,
      });

      const result = {
        ct: encrypted.toString(),
        iv: iv.toString(CryptoJS.enc.Hex),
        s: salt.toString(CryptoJS.enc.Hex),
      };

      const finalPayload = Buffer.from(JSON.stringify(result)).toString('base64');

      return finalPayload;
    } catch (error) {
      return null;
    }
  }

  // Desencriptar datos
  static decrypt(base64Input) {
    try {
      const jsonStr = Buffer.from(base64Input, 'base64').toString('utf8');
      const json = JSON.parse(jsonStr);

      const salt = CryptoJS.enc.Hex.parse(json.s);
      const iv = CryptoJS.enc.Hex.parse(json.iv);
      const ciphertext = json.ct;

      const key = this.deriveKey(salt);

      const decrypted = CryptoJS.AES.decrypt(ciphertext, key, { iv: iv });
      const decryptedString = decrypted.toString(CryptoJS.enc.Utf8);

      try {
        return JSON.parse(decryptedString);
      } catch (e) {
        return decryptedString;
      }
    } catch (error) {
      return null;
    }
  }
}

export { Transmision };


