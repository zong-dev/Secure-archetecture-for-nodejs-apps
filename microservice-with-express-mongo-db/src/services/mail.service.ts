import config from "@/config";
import { EmailSenders, EmailTemplates } from "@/utils/enums";
import { Inject, Service } from "typedi";
import { EmailTemplate } from 'email-templates';
import Bluebird from 'bluebird';
import path from 'path';


@Service()
export default class MailService {
    constructor(
        @Inject('emailClient') private emailClient,
    ){ }
        

    private LoadTemplate(templateName: EmailTemplates, contexts) {
        try {
            let template = new EmailTemplate(path.join(__dirname, 'emails', templateName))
            return Bluebird.all(contexts.map((context) => {
                return new Promise((resolve, reject) => {
                    template.render(context, (err, result) => {
                        if (err) reject(err);
                        else resolve({
                            email: result, context
                        });
                    })
                })
            }))
        } catch (e) {
            throw new Error(e)
        }
    }


    private SendEmail({ template, data}) {
        try {
            this.LoadTemplate( template, data ).then((results) => {
                return Bluebird.all(results.map((result) => {
                    this.emailClient.sendMail({
                        to: result.context.email,
                        from: result.context.from,
                        subject: result.email.subject,
                        html: result.email.html,
                        text: result.email.text,
                    });
                }));
            })
            
        } catch (e) {
            throw new Error(e)
        }
    }

    public async SendWelcomeEmail({ email, name }){
        const recievers = [
            {
                from: `Excited User <${EmailSenders.NO_REPLY}@${config.domain}>`,
                to: [email],
                name,
            }
        ];
        try {
            this.SendEmail({ template: EmailTemplates.WELCOME, data: recievers });
            return { delivered: 1, status: 'ok' };
        } catch(e) {
            return  { delivered: 0, status: 'error' };
        }
    }
}