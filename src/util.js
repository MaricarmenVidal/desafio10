import { fileURLToPath } from "url"; 
import path, { dirname } from "path"; 
import multer from "multer";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export function getProductsFilePath() {
    return path.join(__dirname, "../products.json");
}

export function configureMulter() {
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, path.join(__dirname, './public/images'));
        },
        filename: function (req, file, cb) {
            cb(null, file.originalname);
        },
    });

    return multer({ storage: storage });
}

export default __dirname;