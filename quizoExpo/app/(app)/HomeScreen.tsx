import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';


const HomeScreen = () => {
	const router = useRouter();

	return (
		<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', gap: 50 }}>
			<TouchableOpacity onPress={() => router.push('/ClassList')}>
				<Text style={{ color: '#1E90FF', textAlign: 'center' }}>
					ClassList
				</Text>
			</TouchableOpacity>
			<TouchableOpacity onPress={() => router.push('/CreateBatch')}>
				<Text style={{ color: '#1E90FF', textAlign: 'center' }}>
					CreateBatch
				</Text>
			</TouchableOpacity>
			<TouchableOpacity onPress={() => router.push('/SelectQuestions')}>
				<Text style={{ color: '#1E90FF', textAlign: 'center' }}>
					SelectQuestions
				</Text>
			</TouchableOpacity>
			<TouchableOpacity onPress={() => router.push('/Leaderboard')}>
				<Text style={{ color: '#1E90FF', textAlign: 'center' }}>
					Leaderboard
				</Text>
			</TouchableOpacity>
		</View>
	)
}

export default HomeScreen

const styles = StyleSheet.create({})