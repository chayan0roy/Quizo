import { MaterialIcons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

// Mock data remains the same
const mockQuizData = [
    {
        _id: '1',
        subjectName: 'Mathematics',
        topicName: 'Algebra',
        questions: [
            {
                questionText: 'What is the quadratic formula?',
                options: ['Option A', 'Option B', 'Option C', 'Option D'],
                correctAnswer: 'Option B'
            },
            {
                questionText: 'Solve for x: 2x + 5 = 15',
                options: ['5', '10', '7.5', '20'],
                correctAnswer: '5'
            }
        ]
    },
    {
        _id: '2',
        subjectName: 'Mathematics',
        topicName: 'Geometry',
        questions: [
            {
                questionText: 'What is the area of a circle?',
                options: ['πr²', '2πr', 'πd', '2πr²'],
                correctAnswer: 'πr²'
            }
        ]
    },
    {
        _id: '3',
        subjectName: 'Science',
        topicName: 'Physics',
        questions: [
            {
                questionText: 'What is Newton\'s first law?',
                options: ['Law of inertia', 'F=ma', 'Action-reaction', 'Law of gravitation'],
                correctAnswer: 'Law of inertia'
            },
            {
                questionText: 'What is the unit of force?',
                options: ['Newton', 'Joule', 'Watt', 'Pascal'],
                correctAnswer: 'Newton'
            }
        ]
    },
    {
        _id: '4',
        subjectName: 'Science',
        topicName: 'Chemistry',
        questions: [
            {
                questionText: 'What is the atomic number of Oxygen?',
                options: ['8', '16', '6', '10'],
                correctAnswer: '8'
            }
        ]
    }
];


const CustomCheckbox = ({ value, onValueChange }) => (
    <TouchableOpacity onPress={onValueChange} style={styles.checkboxContainer}>
        <View style={[styles.checkbox, value && styles.checked]}>
            {value && <MaterialIcons name="check" size={16} color="#fff" />}
        </View>
    </TouchableOpacity>
);

const SelectQuestions = () => {
    const [loading, setLoading] = useState(true);
    const [subjects, setSubjects] = useState([]);
    const [expandedSubject, setExpandedSubject] = useState(null);
    const [expandedTopic, setExpandedTopic] = useState(null);
    const [selectedQuestions, setSelectedQuestions] = useState([]);

    // Group data by subject and topic
    useEffect(() => {
        setLoading(true);

        setTimeout(() => {
            const groupedData = mockQuizData.reduce((acc, quiz) => {
                let subject = acc.find(s => s.name === quiz.subjectName);
                if (!subject) {
                    subject = { name: quiz.subjectName, topics: [] };
                    acc.push(subject);
                }

                let topic = subject.topics.find(t => t.name === quiz.topicName);
                if (!topic) {
                    topic = {
                        name: quiz.topicName,
                        questions: quiz.questions.map(q => ({
                            ...q,
                            id: `${quiz._id}-${quiz.questions.indexOf(q)}`
                        }))
                    };
                    subject.topics.push(topic);
                }

                return acc;
            }, []);

            setSubjects(groupedData);
            setLoading(false);
        }, 1000);
    }, []);




    const toggleSubject = (subjectName) => {
        setExpandedSubject(expandedSubject === subjectName ? null : subjectName);
        setExpandedTopic(null); // Collapse any open topic when opening a new subject
    };

    const toggleTopic = (topicName) => {
        setExpandedTopic(expandedTopic === topicName ? null : topicName);
    };

    const toggleQuestionSelection = (questionId) => {
        setSelectedQuestions(prev =>
            prev.includes(questionId)
                ? prev.filter(id => id !== questionId)
                : [...prev, questionId]
        );
    };

    const toggleAllQuestionsInTopic = (topicQuestions) => {
        const allSelected = topicQuestions.every(q => selectedQuestions.includes(q.id));

        if (allSelected) {
            // Deselect all
            setSelectedQuestions(prev =>
                prev.filter(id => !topicQuestions.some(q => q.id === id))
            );
        } else {
            // Select all
            const newSelections = topicQuestions
                .filter(q => !selectedQuestions.includes(q.id))
                .map(q => q.id);
            setSelectedQuestions(prev => [...prev, ...newSelections]);
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#5f27cd" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <ScrollView style={styles.scrollContainer}>
                {subjects.map((subject) => (
                    <View key={subject.name} style={styles.subjectContainer}>
                        <TouchableOpacity
                            style={styles.subjectHeader}
                            onPress={() => toggleSubject(subject.name)}
                        >
                            <Text style={styles.subjectName}>{subject.name}</Text>
                            <MaterialIcons
                                name={expandedSubject === subject.name ? "keyboard-arrow-up" : "keyboard-arrow-down"}
                                size={24}
                                color="#5f27cd"
                            />
                        </TouchableOpacity>

                        {expandedSubject === subject.name && (
                            <View style={styles.topicsContainer}>
                                {subject.topics.map((topic) => (
                                    <View key={`${subject.name}-${topic.name}`} style={styles.topicContainer}>
                                        <TouchableOpacity
                                            style={styles.topicHeader}
                                            onPress={() => toggleTopic(topic.name)}
                                        >
                                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                <CustomCheckbox
                                                    value={topic.questions.every(q => selectedQuestions.includes(q.id))}
                                                    onValueChange={() => toggleAllQuestionsInTopic(topic.questions)}
                                                />
                                                <Text style={styles.topicName}>{topic.name}</Text>
                                            </View>
                                            <MaterialIcons
                                                name={expandedTopic === topic.name ? "keyboard-arrow-up" : "keyboard-arrow-down"}
                                                size={24}
                                                color="#5f27cd"
                                            />
                                        </TouchableOpacity>

                                        {expandedTopic === topic.name && (
                                            <View style={styles.questionsContainer}>
                                                {topic.questions.map((question) => (
                                                    <View key={question.id} style={styles.questionItem}>
                                                        <CustomCheckbox
                                                            value={selectedQuestions.includes(question.id)}
                                                            onValueChange={() => toggleQuestionSelection(question.id)}
                                                        />
                                                        <Text style={styles.questionText}>{question.questionText}</Text>
                                                    </View>
                                                ))}
                                            </View>
                                        )}
                                    </View>
                                ))}
                            </View>
                        )}
                    </View>
                ))}
            </ScrollView>

            {selectedQuestions.length > 0 && (
                <View style={styles.selectionSummary}>
                    <Text style={styles.summaryText}>
                        {selectedQuestions.length} question{selectedQuestions.length !== 1 ? 's' : ''} selected
                    </Text>
                    <TouchableOpacity style={styles.proceedButton}>
                        <Text style={styles.proceedButtonText}>Proceed</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fe',
        padding: 15,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8f9fe',
    },
    header: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#5f27cd',
        marginBottom: 20,
    },
    scrollContainer: {
        flex: 1,
    },
    subjectContainer: {
        marginBottom: 10,
        backgroundColor: '#fff',
        borderRadius: 8,
        overflow: 'hidden',
        elevation: 2,
    },
    subjectHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        backgroundColor: '#f0e6ff',
    },
    subjectName: {
        fontSize: 18,
        fontWeight: '600',
        color: '#5f27cd',
    },
    topicsContainer: {
        paddingHorizontal: 10,
    },
    topicContainer: {
        marginTop: 5,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    topicHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 5,
    },
    topicName: {
        fontSize: 16,
        fontWeight: '500',
        color: '#333',
        marginLeft: 8,
    },
    questionsContainer: {
        paddingLeft: 30,
        paddingBottom: 10,
    },
    questionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
    },
    questionText: {
        fontSize: 14,
        color: '#555',
        marginLeft: 8,
        flexShrink: 1,
    },
    selectionSummary: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },
    summaryText: {
        fontSize: 16,
        color: '#5f27cd',
        fontWeight: '500',
    },
    proceedButton: {
        backgroundColor: '#5f27cd',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    proceedButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    checkboxContainer: {
        padding: 8,
    },
    checkbox: {
        width: 20,
        height: 20,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#aaa',
        justifyContent: 'center',
        alignItems: 'center',
    },
    checked: {
        backgroundColor: '#5f27cd',
        borderColor: '#5f27cd',
    },
});

export default SelectQuestions;










