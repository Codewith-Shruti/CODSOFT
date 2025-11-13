document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const resultDisplay = document.getElementById('result-display');
    const expressionDisplay = document.getElementById('expression-display');
    const keypad = document.getElementById('keypad');

    // --- State Variables ---
    let currentInput = '0'; // The number currently being typed
    let previousValue = '';  // The first number in an operation
    let operator = null;     // The selected operator (+, -, *, /)

    // --- Main Event Listener (Event Delegation) ---
    keypad.addEventListener('click', (e) => {
        if (!e.target.matches('button')) return;

        const button = e.target;
        const action = button.dataset.action;
        const value = button.dataset.value;

        // Route button clicks to the correct handler
        if (action) {
            // Action button (AC, DEL, =, %)
            handleAction(action);
        } else if (button.classList.contains('btn-operator')) {
            // Operator button (+, -, *, /)
            handleOperator(value);
        } else if (value) {
            // Number or decimal button
            handleInput(value);
        }

        updateDisplay();
    });

    // --- Input Handlers ---

    /**
     * Handles number and decimal inputs
     */
    function handleInput(value) {
        if (value === '.') {
            if (!currentInput.includes('.')) {
                currentInput += '.';
            }
        } else {
            if (currentInput === '0') {
                currentInput = value;
            } else {
                currentInput += value;
            }
        }
    }

    /**
     * Handles actions (equals, clear, delete, percent)
     */
    function handleAction(action) {
        switch (action) {
            case 'equals':
                handleEquals();
                break;
            case 'clear':
                clearAll();
                break;
            case 'delete':
                deleteLast();
                break;
            case 'percent':
                handlePercent();
                break;
        }
    }

    /**
     * Handles operator clicks (+, -, *, /)
     */
    function handleOperator(op) {
        // If we are chaining operations (e.g., 5 + 5 + ...), calculate first
        if (previousValue !== '' && operator) {
            handleEquals();
        }
        
        previousValue = currentInput;
        operator = op;
        currentInput = '0'; // Ready for the next number
    }

    /**
     * Handles the equals button click
     */
    function handleEquals() {
        if (previousValue === '' || operator === null) return;

        const result = calculate();
        
        currentInput = String(result);
        previousValue = '';
        operator = null;
    }

    /**
    * Performs the calculation
    */
    function calculate() {
        const prev = parseFloat(previousValue);
        const curr = parseFloat(currentInput);

        if (isNaN(prev) || isNaN(curr)) return '';

        let result;
        switch (operator) {
            case '+': result = prev + curr; break;
            case '-': result = prev - curr; break;
            case '*': result = prev * curr; break;
            case '/': 
                if (curr === 0) {
                    return 'Error'; // Handle division by zero
                }
                result = prev / curr; 
                break;
            default: return '';
        }
        // Format to avoid floating point issues (e.g., 0.1 + 0.2)
        return parseFloat(result.toPrecision(12));
    }

    /**
     * Clears all state (AC button)
     */
    function clearAll() {
        currentInput = '0';
        previousValue = '';
        operator = null;
    }

    /**
     * Deletes the last character (DEL button)
     */
    function deleteLast() {
        if (currentInput.length === 1) {
            currentInput = '0';
        } else {
            currentInput = currentInput.slice(0, -1);
        }
    }

    /**
     * Handles the percent button click
     */
    function handlePercent() {
        if (currentInput === '0') return;
        currentInput = String(parseFloat(currentInput) / 100);
    }

    // --- UI Function ---

    /**
     * Updates the display with the current state
     */
    function updateDisplay() {
        resultDisplay.textContent = currentInput;
        if (operator) {
            expressionDisplay.textContent = `${previousValue} ${operator}`;
        } else {
            expressionDisplay.textContent = '';
        }
    }

    // Initial display update
    updateDisplay();
});