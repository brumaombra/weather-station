import sys

# Main function
def main():
    if len(sys.argv) > 1: # Check if there are parameters
        process_data(sys.argv[1])
    else:
        print("No parameters")

# Function to process data
def process_data(data):
    try:
        result = f"Elaborato: {data}"
        print(result)
    except Exception as e:
        print(f"Error: {str(e)}", file=sys.stderr)
        sys.exit(1)

# Call the main function only if the script is executed directly (not imported as a module)
if __name__ == "__main__":
    main()