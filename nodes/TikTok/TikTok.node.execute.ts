import { IExecuteFunctions } from 'n8n-workflow';
import { apiRequest } from './GenericFunctions';

export async function execute(this: IExecuteFunctions) {
	const items = this.getInputData();
	const returnData = [];
	const resource = this.getNodeParameter('resource', 0) as string;
	const operation = this.getNodeParameter('operation', 0) as string;

	for (let i = 0; i < items.length; i++) {
		try {
			let response;

			// Operações de Vídeo
			if (resource === 'video') {
				if (operation === 'upload') {
					const videoFile = this.getNodeParameter('videoFile', i) as string;
					
					// 1. Iniciar upload
					const initResponse = await apiRequest.call(
						this,
						'POST',
						'/video/init/',
						{ source: 'FILE_UPLOAD' }
					);

					// 2. Upload do vídeo
					const formData = new FormData();
					formData.append('video', videoFile);
					formData.append('upload_id', initResponse.data.upload_id);

					response = await apiRequest.call(
						this,
						'POST',
						'/video/upload/',
						formData,
						{},
						{
							headers: {
								'Content-Type': 'multipart/form-data',
							},
						}
					);
				}

				if (operation === 'delete') {
					const videoId = this.getNodeParameter('videoId', i) as string;
					response = await apiRequest.call(
						this,
						'POST',
						`/video/delete/`,
						{ video_id: videoId }
					);
				}
			}

			// Operações de Post
			if (resource === 'post') {
				if (operation === 'create') {
					const videoId = this.getNodeParameter('videoId', i) as string;
					const caption = this.getNodeParameter('caption', i) as string;
					const additionalFields = this.getNodeParameter('additionalFields', i) as {
						scheduleTime?: string;
						privacyLevel?: string;
						allowComments?: boolean;
						brandContent?: boolean;
						music?: string;
					};

					const body: any = {
						video_id: videoId,
						caption,
						...additionalFields,
					};

					response = await apiRequest.call(
						this,
						'POST',
						'/post/publish/',
						body
					);
				}

				if (operation === 'delete') {
					const postId = this.getNodeParameter('postId', i) as string;
					response = await apiRequest.call(
						this,
						'POST',
						`/post/delete/`,
						{ post_id: postId }
					);
				}

				if (operation === 'get') {
					const postId = this.getNodeParameter('postId', i) as string;
					response = await apiRequest.call(
						this,
						'GET',
						`/post/info/`,
						{ post_id: postId }
					);
				}

				if (operation === 'list') {
					response = await apiRequest.call(
						this,
						'GET',
						'/post/list/'
					);
				}
			}

			// Operações de Usuário
			if (resource === 'user') {
				if (operation === 'info') {
					response = await apiRequest.call(
						this,
						'GET',
						'/user/info/'
					);
				}

				if (operation === 'videos') {
					response = await apiRequest.call(
						this,
						'GET',
						'/user/videos/'
					);
				}
			}

			// Operações de Analytics
			if (resource === 'analytics') {
				const metrics = this.getNodeParameter('metrics', i) as string[];
				const dateRange = this.getNodeParameter('dateRange', i) as string;

				if (operation === 'postStats') {
					const postId = this.getNodeParameter('postId', i) as string;
					response = await apiRequest.call(
						this,
						'GET',
						'/post/analytics/',
						{
							post_id: postId,
							metrics: metrics.join(','),
							date_range: dateRange,
						}
					);
				}

				if (operation === 'accountStats') {
					response = await apiRequest.call(
						this,
						'GET',
						'/user/analytics/',
						{
							metrics: metrics.join(','),
							date_range: dateRange,
						}
					);
				}
			}

			returnData.push({
				json: response,
				pairedItem: {
					item: i,
				},
			});
		} catch (error) {
			if (this.continueOnFail()) {
				returnData.push({
					json: {
						error: error.message,
					},
					pairedItem: {
						item: i,
					},
				});
				continue;
			}
			throw error;
		}
	}

	return [returnData];
}
