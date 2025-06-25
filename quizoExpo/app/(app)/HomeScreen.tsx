import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';


const HomeScreen = () => {
	const router = useRouter();

	return (
		<ScrollView style={{ flex: 1, padding: 20, backgroundColor: '#f0f0f0', }}>

			<TouchableOpacity onPress={() => router.push('/Profile')} style={{ backgroundColor: '#5139ff', padding: 10, borderRadius: 5 }}>
				<Text style={{ color: '#fff', textAlign: 'center' }}>
					Profile
				</Text>
			</TouchableOpacity>
			<TouchableOpacity onPress={() => router.push('/CreateClass')} style={{ backgroundColor: '#5139ff', padding: 10, borderRadius: 5 }}>
				<Text style={{ color: '#fff', textAlign: 'center' }}>
					CreateClass
				</Text>
			</TouchableOpacity>
			<TouchableOpacity onPress={() => router.push('/ClassList')} style={{ backgroundColor: '#5139ff', padding: 10, borderRadius: 5 }}>
				<Text style={{ color: '#fff', textAlign: 'center' }}>
					ClassList
				</Text>
			</TouchableOpacity>
			<TouchableOpacity onPress={() => router.push('/SelectQuestions')} style={{ backgroundColor: '#5139ff', padding: 10, borderRadius: 5 }}>
				<Text style={{ color: '#fff', textAlign: 'center' }}>
					SelectQuestions
				</Text>
			</TouchableOpacity>
			<TouchableOpacity onPress={() => router.push('/QuizSchedule')} style={{ backgroundColor: '#5139ff', padding: 10, borderRadius: 5 }}>
				<Text style={{ color: '#fff', textAlign: 'center' }}>
					QuizSchedule
				</Text>
			</TouchableOpacity>
			<TouchableOpacity onPress={() => router.push('/Quiz')} style={{ backgroundColor: '#5139ff', padding: 10, borderRadius: 5 }}>
				<Text style={{ color: '#fff', textAlign: 'center' }}>
					Quiz
				</Text>
			</TouchableOpacity>
			<TouchableOpacity onPress={() => router.push('/Result')} style={{ backgroundColor: '#5139ff', padding: 10, borderRadius: 5 }}>
				<Text style={{ color: '#fff', textAlign: 'center' }}>
					Result
				</Text>
			</TouchableOpacity>
			<TouchableOpacity onPress={() => router.push('/ViewAnswers')} style={{ backgroundColor: '#5139ff', padding: 10, borderRadius: 5 }}>
				<Text style={{ color: '#fff', textAlign: 'center' }}>
					ViewAnswers
				</Text>
			</TouchableOpacity>
			<TouchableOpacity onPress={() => router.push('/Leaderboard')} style={{ backgroundColor: '#5139ff', padding: 10, borderRadius: 5 }}>
				<Text style={{ color: '#fff', textAlign: 'center' }}>
					Leaderboard
				</Text>
			</TouchableOpacity>

			<TouchableOpacity onPress={() => router.push('/StudentList')} style={{ backgroundColor: '#5139ff', padding: 10, borderRadius: 5 }}>
				<Text style={{ color: '#fff', textAlign: 'center' }}>
					StudentList
				</Text>
			</TouchableOpacity>
		</ScrollView>
	)
}

export default HomeScreen

const styles = StyleSheet.create({})