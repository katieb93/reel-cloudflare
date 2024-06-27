function submitForm() {
    // Assuming the form is submitted using JavaScript, you can access the form data here

    // Check if both question1 and question2 have answers
    const question1Answer = document.getElementById('year').value;
    const question2Answer = document.getElementById('numplayers').value;

    if (question1Answer && question2Answer) {
        // Show the hidden third question
        document.getElementById('question3').style.display = 'block';
    }
}