import React, { useEffect, useState } from 'react';
import { StyleSheet, View, KeyboardAvoidingView, Platform } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import firestore from '@react-native-firebase/firestore';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { TouchableOpacity, ScrollView } from 'react-native-gesture-handler';
import { ProgressBar } from 'react-native-paper';
import HeaderBack from "@/components/HeaderBack";
import { RamaBackView, RamaButton, RamaHStack, RamaInput, RamaText, RamaVStack } from "@/components/Themed";
import { useTheme } from "@/context/ThemeContext";
import { Post, TextBlock, } from './types';
import auth from "@react-native-firebase/auth";
type Comment = {

}

interface CreatorData {
    displayName: string;
    profilePicture: string; 
}

export default function PostDetailsScreen() {
    const { postId, creatorId } = useLocalSearchParams<{ postId: string; creatorId: string }>();
    const [creator, setCreator] = useState<CreatorData | null>(null);
    const [post, setPost] = useState<Post | null>(null);
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(true);
    const { colours } = useTheme();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [creatorDoc, postDoc] = await Promise.all([
                    firestore().collection("users").doc(creatorId).get(),
                    firestore().collection("posts").doc(postId).get()
                ]);

                if (creatorDoc.exists) {
                    setCreator(creatorDoc.data() as CreatorData);
                } else {
                    console.error("Creator not found");
                }

                if (postDoc.exists) {
                    setPost(postDoc.data() as Post);
                } else {
                    console.error("Post not found");
                }

                // Fetch comments
                const commentsSnapshot = await firestore()
                    .collection("posts")
                    .doc(postId)
                    .collection("comments")
                    .orderBy("createdAt", "desc")
                    .get();

                const fetchedComments = commentsSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                } as Comment));

                setComments(fetchedComments);

            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [creatorId, postId]);

    const formatTimeSince = (timestamp: number) => {
        const now = Date.now();
        const diff = now - timestamp;
        const seconds = Math.floor(diff / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (days > 0) return `${days}d ago`;
        if (hours > 0) return `${hours}h ago`;
        if (minutes > 0) return `${minutes}m ago`;
        return 'Just now';
    };

    const renderTextBlock = (block: TextBlock, index: number) => (
        <RamaText key={index} style={[styles.textBlock, block.style]}>
            {block.text}
        </RamaText>
    );

    const handleSendComment = async () => {
        if (!newComment.trim()) return;

        try {
            const newCommentRef = await firestore()
                .collection("posts")
                .doc(postId)
                .collection("comments")
                .add({
                    content: newComment,
                    createdAt: firestore.FieldValue.serverTimestamp(),
                    userId: auth().currentUser().uid,
                });

            const newCommentDoc = await newCommentRef.get();
            const addedComment = { id: newCommentDoc.id, ...newCommentDoc.data() } as Comment;

            setComments(prevComments => [addedComment, ...prevComments]);
            setNewComment('');
        } catch (error) {
            console.error("Error adding comment:", error);
        }
    };

    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <ProgressBar color={colours.primary} indeterminate />
            </SafeAreaView>
        );
    }

    if (!creator || !post) {
        return (
            <SafeAreaView style={styles.container}>
                <RamaText>Error loading post details</RamaText>
            </SafeAreaView>
        );
    }

    const renderContent = () => {
        switch (post.post_type) {
            case "text":
                return <>{post.textBlocks.map(renderTextBlock)}</>;
            case "default":
                return (
                    <View>
                        {post.mediaUrls.length > 0 && post.mediaUrls.map((url, index) => (
                            <Image key={index} source={{ uri: url }} style={styles.mediaImage} />
                        ))}
                        {post.content.length > 0 && (
                            <View style={{paddingVertical: 12}}>
                                <RamaText style={{fontSize: 18}}>{post.content}</RamaText>
                            </View>
                        )}
                    </View>
                );
            default:
                return null;
        }
    };

    return (
        <RamaBackView style={styles.container}>
            <SafeAreaView style={styles.safeArea}>
                <KeyboardAvoidingView 
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    style={styles.keyboardAvoidingView}
                >
                    <ScrollView contentContainerStyle={styles.scrollView}>
                        <RamaHStack style={styles.header}>
                            <RamaHStack>
                                <HeaderBack />
                                <RamaHStack style={styles.creatorInfo}>
                                    <TouchableOpacity activeOpacity={0.5}>
                                        <Image 
                                            source={{ uri: creator.profilePicture }}
                                            style={styles.profilePicture}
                                        />
                                    </TouchableOpacity>
                                    <RamaVStack>
                                        <RamaText style={styles.displayName}>{creator.displayName}</RamaText>
                                        <RamaText style={styles.timeAgo}>{formatTimeSince(post.createdAt.toMillis())}</RamaText>
                                    </RamaVStack>
                                </RamaHStack>
                            </RamaHStack>
                        </RamaHStack>
                        
                        <View style={styles.postContent}>
                            {renderContent()}
                        </View>

                        <View style={styles.commentsSection}>
                            <RamaText style={styles.commentsSectionTitle}>Your Replies</RamaText>
                            {comments.map((comment) => (
                                <View key={comment.id} style={styles.commentItem}>
                                    <RamaText style={styles.commentContent}>{comment.content}</RamaText>
                                    <RamaText style={styles.commentTime}>{formatTimeSince(comment.createdAt.toMillis())}</RamaText>
                                </View>
                            ))}
                        </View>
                    </ScrollView>

                    <RamaHStack style={styles.commentInputContainer}>
                        <RamaInput 
                            placeholder="Add a reply..."
                            value={newComment}
                            onChangeText={setNewComment}
                            style={styles.commentInput}
                        />
                        <RamaButton variant="link" onPress={handleSendComment}>
                            Send
                        </RamaButton>
                    </RamaHStack>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </RamaBackView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    safeArea: {
        flex: 1,
    },
    keyboardAvoidingView: {
        flex: 1,
    },
    scrollView: {
        flexGrow: 1,
    },
    header: {
        paddingHorizontal: 12,
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    creatorInfo: {
        alignItems: 'center',
    },
    profilePicture: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 8,
    },
    displayName: {
        fontWeight: 'bold',
    },
    timeAgo: {
        fontSize: 12,
        opacity: 0.7,
    },
    postContent: {
        padding: 12,
    },
    mediaImage: {
        width: '100%',
        height: 200,
        marginBottom: 12,
        borderRadius: 8,
    },
    textBlock: {
        marginBottom: 8,
    },
    commentsSection: {
        padding: 12,
    },
    commentsSectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    commentItem: {
        marginBottom: 8,
    },
    commentContent: {
        fontSize: 14,
    },
    commentTime: {
        fontSize: 12,
        opacity: 0.7,
    },
    commentInputContainer: {
        padding: 12,
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
    },
    commentInput: {
        flex: 1,
        marginRight: 8,
    },
});