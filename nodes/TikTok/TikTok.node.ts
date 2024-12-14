import { INodeType, INodeTypeDescription } from 'n8n-workflow';

export class TikTok implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'TikTok',
		name: 'tiktok',
		icon: 'file:tiktok.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Crie e gerencie posts no TikTok',
		defaults: {
			name: 'TikTok',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'tikTokApi',
				required: true,
			},
		],
		requestDefaults: {
			baseURL: '={{$credentials.environment === "production" ? "https://open-api.tiktok.com" : "https://open-sandbox.tiktok.com"}}',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
		},
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Post',
						value: 'post',
					},
					{
						name: 'Video',
						value: 'video',
					},
					{
						name: 'User',
						value: 'user',
					},
					{
						name: 'Analytics',
						value: 'analytics',
					},
				],
				default: 'post',
			},
			// Operações para Posts
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['post'],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Criar uma nova postagem',
						action: 'Create a post',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Excluir uma postagem',
						action: 'Delete a post',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Obter detalhes de uma postagem',
						action: 'Get a post',
					},
					{
						name: 'List',
						value: 'list',
						description: 'Listar postagens',
						action: 'List posts',
					},
				],
				default: 'create',
			},
			// Operações para Vídeos
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['video'],
					},
				},
				options: [
					{
						name: 'Upload',
						value: 'upload',
						description: 'Fazer upload de um vídeo',
						action: 'Upload a video',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Excluir um vídeo',
						action: 'Delete a video',
					},
				],
				default: 'upload',
			},
			// Operações para Usuário
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['user'],
					},
				},
				options: [
					{
						name: 'Info',
						value: 'info',
						description: 'Obter informações do usuário',
						action: 'Get user info',
					},
					{
						name: 'Videos',
						value: 'videos',
						description: 'Listar vídeos do usuário',
						action: 'List user videos',
					},
				],
				default: 'info',
			},
			// Operações para Analytics
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['analytics'],
					},
				},
				options: [
					{
						name: 'Get Post Stats',
						value: 'postStats',
						description: 'Obter estatísticas de uma postagem',
						action: 'Get post statistics',
					},
					{
						name: 'Get Account Stats',
						value: 'accountStats',
						description: 'Obter estatísticas da conta',
						action: 'Get account statistics',
					},
				],
				default: 'postStats',
			},
			// Campos para Upload de Vídeo
			{
				displayName: 'Video File',
				name: 'videoFile',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						operation: ['upload'],
						resource: ['video'],
					},
				},
				default: '',
				description: 'Arquivo de vídeo para upload',
			},
			// Campos para Post
			{
				displayName: 'Video ID',
				name: 'videoId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						operation: ['create'],
						resource: ['post'],
					},
				},
				default: '',
				description: 'ID do vídeo para criar o post',
			},
			{
				displayName: 'Caption',
				name: 'caption',
				type: 'string',
				displayOptions: {
					show: {
						operation: ['create'],
						resource: ['post'],
					},
				},
				default: '',
				description: 'Legenda para a postagem',
			},
			// Campos Adicionais
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						operation: ['create'],
						resource: ['post'],
					},
				},
				options: [
					{
						displayName: 'Schedule Time',
						name: 'scheduleTime',
						type: 'dateTime',
						default: '',
						description: 'Data e hora para agendar a postagem',
					},
					{
						displayName: 'Privacy Level',
						name: 'privacyLevel',
						type: 'options',
						options: [
							{
								name: 'Public',
								value: 'public',
							},
							{
								name: 'Friends',
								value: 'friends',
							},
							{
								name: 'Private',
								value: 'private',
							},
						],
						default: 'public',
					},
					{
						displayName: 'Allow Comments',
						name: 'allowComments',
						type: 'boolean',
						default: true,
						description: 'Se comentários são permitidos na postagem',
					},
					{
						displayName: 'Brand Content',
						name: 'brandContent',
						type: 'boolean',
						default: false,
						description: 'Se é um conteúdo patrocinado',
					},
					{
						displayName: 'Music',
						name: 'music',
						type: 'string',
						default: '',
						description: 'ID da música a ser usada no vídeo',
					},
				],
			},
			// Campos para Analytics
			{
				displayName: 'Metrics',
				name: 'metrics',
				type: 'multiOptions',
				displayOptions: {
					show: {
						resource: ['analytics'],
					},
				},
				options: [
					{
						name: 'Views',
						value: 'views',
					},
					{
						name: 'Likes',
						value: 'likes',
					},
					{
						name: 'Comments',
						value: 'comments',
					},
					{
						name: 'Shares',
						value: 'shares',
					},
					{
						name: 'Profile Views',
						value: 'profile_views',
					},
					{
						name: 'Followers',
						value: 'followers',
					},
				],
				default: ['views', 'likes'],
				description: 'Métricas para analisar',
			},
			{
				displayName: 'Date Range',
				name: 'dateRange',
				type: 'options',
				displayOptions: {
					show: {
						resource: ['analytics'],
					},
				},
				options: [
					{
						name: 'Last 7 Days',
						value: '7d',
					},
					{
						name: 'Last 30 Days',
						value: '30d',
					},
					{
						name: 'Last 60 Days',
						value: '60d',
					},
				],
				default: '7d',
				description: 'Período para análise',
			},
		],
	};
}
