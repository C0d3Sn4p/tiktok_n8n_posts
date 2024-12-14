import {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class TikTokApi implements ICredentialType {
	name = 'tikTokApi';
	displayName = 'TikTok API';
	documentationUrl = 'https://developers.tiktok.com/doc/login-kit-web';
	properties: INodeProperties[] = [
		{
			displayName: 'Client Key',
			name: 'clientKey',
			type: 'string',
			default: '',
			required: true,
		},
		{
			displayName: 'Client Secret',
			name: 'clientSecret',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			required: true,
		},
		{
			displayName: 'Access Token',
			name: 'accessToken',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			required: true,
		},
		{
			displayName: 'Business Account ID',
			name: 'businessAccountId',
			type: 'string',
			default: '',
			required: true,
			description: 'The ID of your TikTok Business Account',
		},
		{
			displayName: 'Environment',
			name: 'environment',
			type: 'options',
			default: 'production',
			options: [
				{
					name: 'Production',
					value: 'production',
				},
				{
					name: 'Sandbox',
					value: 'sandbox',
				},
			],
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				'Authorization': '=Bearer {{$credentials.accessToken}}',
				'x-business-id': '={{$credentials.businessAccountId}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: '=https://{{$credentials.environment === "production" ? "open-api" : "open-sandbox"}}.tiktok.com',
			url: '/user/info/',
			method: 'GET',
		},
	};
}
