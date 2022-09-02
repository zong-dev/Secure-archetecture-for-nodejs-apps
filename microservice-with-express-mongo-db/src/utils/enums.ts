import config from "@/config";

export enum EmailSenders{
    NO_REPLY = `no-reply`,
    SUPPORT = 'support',
}

export enum EmailTemplates {
    WELCOME = `welcome`,
}

export enum TokenUses {
    VERIFY_ACCOUNT = "Account Verification", PASSWORD = "Password Reset",
}

export enum NotifyTypes {
    EMAIL, APP, BOTH
}

export enum Roles {
    BASIC, ADMIN
}