import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';


const HomeScreen = () => {
	const router = useRouter();

	return (
		<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', gap: 50, backgroundColor: '#5139ff' }}>
			<TouchableOpacity onPress={() => router.push('/ClassList')} style={{ bacgkgroundColor: '#fff', padding: 10, borderRadius: 5 }}>
				<Text style={{ color: '#fff', textAlign: 'center' }}>
					ClassList
				</Text>
			</TouchableOpacity>
			<TouchableOpacity onPress={() => router.push('/CreateBatch')}  style={{ bacgkgroundColor: '#fff', padding: 10, borderRadius: 5 }}>
				<Text style={{ color: '#fff', textAlign: 'center' }}>

					CreateBatch
				</Text>
			</TouchableOpacity>
			<TouchableOpacity onPress={() => router.push('/SelectQuestions')}  style={{ bacgkgroundColor: '#fff', padding: 10, borderRadius: 5 }}>
				<Text style={{ color: '#fff', textAlign: 'center' }}>

					SelectQuestions
				</Text>
			</TouchableOpacity>
			<TouchableOpacity onPress={() => router.push('/Leaderboard')}  style={{ bacgkgroundColor: '#fff', padding: 10, borderRadius: 5 }}>
				<Text style={{ color: '#fff', textAlign: 'center' }}>

					Leaderboard
				</Text>
			</TouchableOpacity>
		</View>
	)
}

export default HomeScreen

const styles = StyleSheet.create({})