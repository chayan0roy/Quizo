import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, TextInput, Modal, ScrollView, SafeAreaView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { launchImageLibrary } from 'react-native-image-picker';

interface Post {
	id: string;
	user: string;
	content?: string;
	image?: string;
	video?: string;
	likes: number;
	comments: Comment[];
	timestamp: string;
}

interface Comment {
	id: string;
	user: string;
	text: string;
	replies?: Comment[];
}

interface ExpandedState {
	[postId: string]: {
		commentsExpanded: boolean;
		repliesExpanded: {
			[commentId: string]: boolean;
		};
	};
}


const CommunityScreen = () => {
	const [posts, setPosts] = useState<Post[]>([
		{
			id: '1',
			user: 'John Doe',
			content: 'This is a sample text post in our community!',
			image: 'https://picsum.photos/id/237/500/300',
			likes: 15,
			comments: [
				{ id: 'c1', user: 'Alice', text: 'Nice post!' },
				{ id: 'c2', user: 'Bob', text: 'I agree!', replies: [{ id: 'r1', user: 'John', text: 'Thanks!' }] },
			],
			timestamp: '2 hours ago',
		},
		{
			id: '2',
			user: 'Jane Smith',
			image: 'https://picsum.photos/id/237/500/300',
			likes: 42,
			comments: [],
			timestamp: '5 hours ago',
		},
		{
			id: '3',
			user: 'John Doe',
			content: 'This is a sample text post in our community!',
			likes: 15,
			comments: [
				{ id: 'c1', user: 'Alice', text: 'Nice post!' },
				{ id: 'c2', user: 'Bob', text: 'I agree!', replies: [{ id: 'r1', user: 'John', text: 'Thanks!' }] },
				{ id: 'c3', user: 'Bob', text: 'I agree!', replies: [{ id: 'r1', user: 'John', text: 'Thanks!' }] },
				{ id: 'c4', user: 'Bob', text: 'I agree!', replies: [{ id: 'r1', user: 'John', text: 'Thanks!' }] },
				{ id: 'c5', user: 'Bob', text: 'I agree!', replies: [{ id: 'r1', user: 'John', text: 'Thanks!' }] },
				{ id: 'c6', user: 'Bob', text: 'I agree!', replies: [{ id: 'r1', user: 'John', text: 'Thanks!' }] },
				{ id: 'c7', user: 'Bob', text: 'I agree!', replies: [{ id: 'r1', user: 'John', text: 'Thanks!' }] },
			],
			timestamp: '2 hours ago',
		},
		{
			id: '4',
			user: 'Jane Smith',
			image: 'https://picsum.photos/id/237/500/300',
			likes: 42,
			comments: [{ id: 'c1', user: 'Alice', text: 'Nice post!' },],
			timestamp: '5 hours ago',
		},
	]);

	const [modalVisible, setModalVisible] = useState(false);
	const [newPostContent, setNewPostContent] = useState('');
	const [selectedImage, setSelectedImage] = useState<string | null>(null);
	const [commentInputs, setCommentInputs] = useState<{ [key: string]: string }>({});
	const [replyingTo, setReplyingTo] = useState<{ postId: string, commentId?: string } | null>(null);
	const [expandedState, setExpandedState] = useState<ExpandedState>({});


	const toggleComments = (postId: string) => {
		setExpandedState(prev => ({
			...prev,
			[postId]: {
				...prev[postId],
				commentsExpanded: !(prev[postId]?.commentsExpanded || false),
			},
		}));
	};

	const toggleReplies = (postId: string, commentId: string) => {
		setExpandedState(prev => ({
			...prev,
			[postId]: {
				...prev[postId],
				repliesExpanded: {
					...(prev[postId]?.repliesExpanded || {}),
					[commentId]: !(prev[postId]?.repliesExpanded?.[commentId] || false),
				},
			},
		}));
	};


	const handleCreatePost = () => {
		if (!newPostContent && !selectedImage) return;

		const newPost: Post = {
			id: Date.now().toString(),
			user: 'Current User',
			content: newPostContent,
			image: selectedImage || undefined,
			likes: 0,
			comments: [],
			timestamp: 'Just now',
		};

		setPosts([newPost, ...posts]);
		setNewPostContent('');
		setSelectedImage(null);
		setModalVisible(false);
	};

	const selectImage = async () => {
		const result = await launchImageLibrary({
			mediaType: 'mixed',
			quality: 0.8,
		});

		if (!result.didCancel && result.assets && result.assets[0].uri) {
			setSelectedImage(result.assets[0].uri);
		}
	};

	const handleLike = (postId: string) => {
		setPosts(posts.map(post =>
			post.id === postId ? { ...post, likes: post.likes + 1 } : post
		));
	};

	const handleAddComment = (postId: string) => {
		if (!commentInputs[postId]?.trim()) return;

		const newComment: Comment = {
			id: Date.now().toString(),
			user: 'Current User',
			text: commentInputs[postId],
		};

		setPosts(posts.map(post => {
			if (post.id === postId) {
				return {
					...post,
					comments: [...post.comments, newComment],
				};
			}
			return post;
		}));

		setCommentInputs({ ...commentInputs, [postId]: '' });
		setReplyingTo(null);
	};

	const handleAddReply = (postId: string, commentId: string) => {
		if (!commentInputs[`${postId}-${commentId}`]?.trim()) return;

		const newReply: Comment = {
			id: Date.now().toString(),
			user: 'Current User',
			text: commentInputs[`${postId}-${commentId}`],
		};

		setPosts(posts.map(post => {
			if (post.id === postId) {
				return {
					...post,
					comments: post.comments.map(comment => {
						if (comment.id === commentId) {
							return {
								...comment,
								replies: [...(comment.replies || []), newReply],
							};
						}
						return comment;
					}),
				};
			}
			return post;
		}));

		setCommentInputs({ ...commentInputs, [`${postId}-${commentId}`]: '' });
		setReplyingTo(null);
	};

	const renderComment = (comment: Comment, postId: string) => {
		const hasReplies = comment.replies && comment.replies.length > 0;
		const repliesExpanded = expandedState[postId]?.repliesExpanded?.[comment.id] || false;

		return (
			<View key={comment.id} style={styles.commentContainer}>
				<TouchableOpacity
					onPress={() => hasReplies && toggleReplies(postId, comment.id)}
					activeOpacity={hasReplies ? 0.7 : 1}
				>
					<View style={styles.commentContent}>
						<Text style={styles.commentUser}>{comment.user}</Text>
						<Text style={styles.commentText}>{comment.text}</Text>

						{hasReplies && (
							<Text style={styles.replyText}>
								{repliesExpanded ? 'Hide replies' : `Show replies (${comment.replies?.length})`}
							</Text>
						)}
					</View>
				</TouchableOpacity>

				{replyingTo?.postId === postId && replyingTo?.commentId === comment.id && (
					<View style={styles.replyInputContainer}>
						<TextInput
							style={styles.replyInput}
							placeholder="Write a reply..."
							value={commentInputs[`${postId}-${comment.id}`] || ''}
							onChangeText={(text) => setCommentInputs({
								...commentInputs,
								[`${postId}-${comment.id}`]: text
							})}
						/>
						<TouchableOpacity
							style={styles.replyButton}
							onPress={() => handleAddReply(postId, comment.id)}
						>
							<Text style={styles.replyButtonText}>Post</Text>
						</TouchableOpacity>
					</View>
				)}

				{hasReplies && repliesExpanded && (
					<View style={styles.repliesContainer}>
						{comment.replies?.map(reply => (
							<View key={reply.id} style={styles.replyContainer}>
								<Text style={styles.commentUser}>{reply.user}</Text>
								<Text style={styles.commentText}>{reply.text}</Text>
							</View>
						))}
					</View>
				)}
			</View>
		);
	};

	const renderItem = ({ item }: { item: Post }) => (
		<View style={styles.postContainer}>
			<View style={styles.postHeader}>
				<View style={styles.userAvatar} />
				<View>
					<Text style={styles.userName}>{item.user}</Text>
					<Text style={styles.timestamp}>{item.timestamp}</Text>
				</View>
			</View>

			{item.content && <Text style={styles.postContent}>{item.content}</Text>}

			{item.image && (
				<Image source={{ uri: item.image }} style={styles.postImage} resizeMode="cover" />
			)}

			<View style={styles.postStats}>
				<Text style={styles.likesCount}>{item.likes} likes</Text>
			</View>

			<View style={styles.postActions}>
				<TouchableOpacity
					style={styles.actionButton}
					onPress={() => handleLike(item.id)}
				>
					<Icon name="thumb-up" size={20} color="#4267B2" />
					<Text style={styles.actionText}>Like</Text>
				</TouchableOpacity>

				<TouchableOpacity
					style={styles.actionButton}
					onPress={() => setReplyingTo({ postId: item.id })}
				>
					<Icon name="comment" size={20} color="#4267B2" />
					<Text style={styles.actionText}>Comment</Text>
				</TouchableOpacity>

				<TouchableOpacity style={styles.actionButton}>
					<Icon name="share" size={20} color="#4267B2" />
					<Text style={styles.actionText}>Share</Text>
				</TouchableOpacity>
			</View>

			{replyingTo?.postId === item.id && !replyingTo.commentId && (
				<View style={styles.commentInputContainer}>
					<TextInput
						style={styles.commentInput}
						placeholder="Write a comment..."
						value={commentInputs[item.id] || ''}
						onChangeText={(text) => setCommentInputs({
							...commentInputs,
							[item.id]: text
						})}
					/>
					<TouchableOpacity
						style={styles.commentButton}
						onPress={() => handleAddComment(item.id)}
					>
						<Text style={styles.commentButtonText}>Post</Text>
					</TouchableOpacity>
				</View>
			)}

			{item.comments.length > 0 && (
				<View style={styles.commentsSection}>
					<TouchableOpacity
						onPress={() => toggleComments(item.id)}
						style={styles.commentsToggle}
					>
						<Text style={styles.commentsToggleText}>
							{expandedState[item.id]?.commentsExpanded
								? 'Hide comments'
								: `View all comments (${item.comments.length})`}
						</Text>
					</TouchableOpacity>

					{expandedState[item.id]?.commentsExpanded && (
						<View>
							{item.comments.map(comment => renderComment(comment, item.id))}
						</View>
					)}
				</View>
			)}
		</View>
	);

	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.header}>
				<Text style={styles.headerTitle}>Community</Text>
			</View>

			<FlatList
				data={posts}
				renderItem={renderItem}
				keyExtractor={item => item.id}
				contentContainerStyle={styles.listContent}
			/>

			<TouchableOpacity
				style={styles.createPostButton}
				onPress={() => setModalVisible(true)}
			>
				<Icon name="add" size={30} color="white" />
			</TouchableOpacity>

			<Modal
				animationType="slide"
				transparent={true}
				visible={modalVisible}
				onRequestClose={() => setModalVisible(false)}
			>
				<View style={styles.modalContainer}>
					<View style={styles.modalContent}>
						<TouchableOpacity
							style={styles.closeButton}
							onPress={() => setModalVisible(false)}
						>
							<Icon name="close" size={24} color="#333" />
						</TouchableOpacity>

						<Text style={styles.modalTitle}>Create Post</Text>

						<TextInput
							style={styles.postInput}
							multiline
							placeholder="What's on your mind?"
							value={newPostContent}
							onChangeText={setNewPostContent}
						/>

						{selectedImage && (
							<Image source={{ uri: selectedImage }} style={styles.selectedImage} />
						)}

						<View style={styles.mediaButtons}>
							<TouchableOpacity
								style={styles.mediaButton}
								onPress={selectImage}
							>
								<Icon name="image" size={24} color="#4267B2" />
								<Text style={styles.mediaButtonText}>Photo/Video</Text>
							</TouchableOpacity>
						</View>

						<TouchableOpacity
							style={[
								styles.submitButton,
								(!newPostContent && !selectedImage) && styles.submitButtonDisabled
							]}
							onPress={handleCreatePost}
							disabled={!newPostContent && !selectedImage}
						>
							<Text style={styles.submitButtonText}>Post</Text>
						</TouchableOpacity>
					</View>
				</View>
			</Modal>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#f0f2f5',
	},
	header: {
		padding: 15,
		backgroundColor: '#4267B2',
	},
	headerTitle: {
		fontSize: 22,
		fontWeight: 'bold',
		color: 'white',
		textAlign: 'center',
	},
	listContent: {
		paddingBottom: 20,
	},
	postContainer: {
		backgroundColor: 'white',
		marginHorizontal: 10,
		marginTop: 15,
		borderRadius: 10,
		padding: 15,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.1,
		shadowRadius: 3,
		elevation: 2,
	},
	postHeader: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 10,
	},
	userAvatar: {
		width: 40,
		height: 40,
		borderRadius: 20,
		backgroundColor: '#ddd',
		marginRight: 10,
	},
	userName: {
		fontWeight: 'bold',
		fontSize: 16,
	},
	timestamp: {
		fontSize: 12,
		color: '#65676b',
	},
	postContent: {
		fontSize: 16,
		marginBottom: 10,
		lineHeight: 22,
	},
	postImage: {
		width: '100%',
		height: 200,
		borderRadius: 8,
		marginBottom: 10,
	},
	postStats: {
		borderBottomWidth: 1,
		borderBottomColor: '#ddd',
		paddingBottom: 10,
		marginBottom: 10,
	},
	likesCount: {
		color: '#65676b',
	},
	postActions: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		borderBottomWidth: 1,
		borderBottomColor: '#ddd',
		paddingBottom: 10,
		marginBottom: 10,
	},
	actionButton: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: 20,
		paddingVertical: 5,
		borderRadius: 5,
	},
	actionText: {
		marginLeft: 5,
		color: '#65676b',
	},
	commentInputContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		marginTop: 10,
	},
	commentInput: {
		flex: 1,
		borderWidth: 1,
		borderColor: '#ddd',
		borderRadius: 20,
		paddingHorizontal: 15,
		paddingVertical: 10,
		marginRight: 10,
	},
	commentButton: {
		backgroundColor: '#4267B2',
		paddingHorizontal: 15,
		paddingVertical: 10,
		borderRadius: 20,
	},
	commentButtonText: {
		color: 'white',
		fontWeight: 'bold',
	},
	commentsSection: {
		marginTop: 10,
	},
	commentContainer: {
		marginBottom: 10,
		paddingLeft: 10,
		borderLeftWidth: 2,
		borderLeftColor: '#ddd',
	},
	commentUser: {
		fontWeight: 'bold',
		fontSize: 14,
	},
	commentText: {
		fontSize: 14,
		marginTop: 2,
	},
	replyText: {
		color: '#4267B2',
		fontSize: 12,
		marginTop: 5,
	},
	replyContainer: {
		marginLeft: 15,
		marginTop: 5,
		paddingLeft: 10,
		borderLeftWidth: 2,
		borderLeftColor: '#eee',
	},
	replyInputContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		marginTop: 5,
	},
	replyInput: {
		flex: 1,
		borderWidth: 1,
		borderColor: '#ddd',
		borderRadius: 20,
		paddingHorizontal: 15,
		paddingVertical: 8,
		marginRight: 10,
		fontSize: 14,
	},
	replyButton: {
		backgroundColor: '#4267B2',
		paddingHorizontal: 12,
		paddingVertical: 8,
		borderRadius: 20,
	},
	replyButtonText: {
		color: 'white',
		fontWeight: 'bold',
		fontSize: 14,
	},
	createPostButton: {
		position: 'absolute',
		bottom: 30,
		right: 30,
		width: 60,
		height: 60,
		borderRadius: 30,
		backgroundColor: '#4267B2',
		justifyContent: 'center',
		alignItems: 'center',
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.3,
		shadowRadius: 4,
		elevation: 5,
	},
	modalContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'rgba(0,0,0,0.5)',
	},
	modalContent: {
		width: '90%',
		backgroundColor: 'white',
		borderRadius: 10,
		padding: 20,
		maxHeight: '80%',
	},
	closeButton: {
		alignSelf: 'flex-end',
		padding: 5,
	},
	modalTitle: {
		fontSize: 20,
		fontWeight: 'bold',
		marginBottom: 15,
		textAlign: 'center',
	},
	postInput: {
		borderWidth: 1,
		borderColor: '#ddd',
		borderRadius: 8,
		padding: 15,
		minHeight: 100,
		marginBottom: 15,
		fontSize: 16,
	},
	selectedImage: {
		width: '100%',
		height: 200,
		borderRadius: 8,
		marginBottom: 15,
	},
	mediaButtons: {
		flexDirection: 'row',
		marginBottom: 15,
	},
	mediaButton: {
		flexDirection: 'row',
		alignItems: 'center',
		padding: 10,
		borderRadius: 5,
		backgroundColor: '#f0f2f5',
		marginRight: 10,
	},
	mediaButtonText: {
		marginLeft: 5,
		color: '#4267B2',
	},
	submitButton: {
		backgroundColor: '#4267B2',
		padding: 15,
		borderRadius: 5,
		alignItems: 'center',
	},
	submitButtonDisabled: {
		opacity: 0.5,
	},
	submitButtonText: {
		color: 'white',
		fontWeight: 'bold',
		fontSize: 16,
	},
	commentContent: {
		paddingBottom: 8,
	},
	commentsToggle: {
		paddingVertical: 8,
	},
	commentsToggleText: {
		color: '#65676b',
		fontWeight: 'bold',
	},
	repliesContainer: {
		marginLeft: 15,
		borderLeftWidth: 2,
		borderLeftColor: '#eee',
		paddingLeft: 10,
	},
});

export default CommunityScreen;