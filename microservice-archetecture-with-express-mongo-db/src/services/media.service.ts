import { IUser } from "@/interfaces/IUser";
import { Inject, Service } from "typedi";

@Service()
export default class MediaService {
    constructor(
        @Inject('mediaModel') private mediaModel: Models.MediaModel,
        @Inject('cloudinary') private cloudinary,
        @Inject('logger') private logger,
    ) {}


    public async AddFile(file, user: Partial<IUser>) {
        try {
            return this.cloudinary.uploader.upload_stream( async (err, result) => {
                if (err) throw new Error(err)
                const uploadRecord = await this.mediaModel.create({
                    user: user._id,
                    url: result.url,
                    type: result.resource_type,
                    public_id: result.public_id,
                }); 
                return uploadRecord.toObject();
            }).end(file.buffer);
        } catch (e) {
            this.logger.error(e);
            throw e;
        }
    }


    public async RemoveFile(url, user: Partial<IUser>) {
        try {
            const fileRecord = await this.mediaModel.findOne({ user: user._id, url: url });
            if(!fileRecord) throw new Error("File record does not exist")
            await this.cloudinary.uploader
                .destroy(fileRecord.public_id).then((results) => {
                    fileRecord.deleteOne();
                })
            return { status: 'success' }
        } catch (e) {
            this.logger.error(e);
            throw e;
        }
    }

    
}