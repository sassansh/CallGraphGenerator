package BankingApp;
import java.util.*;

public class Bank {
    private List<BankAccount> customers = new ArrayList<>();
    private final Scanner scanner = new Scanner(System.in);

    public void showMenu() {
        int option;
        boolean loop = true;
        System.out.println("==============================================");
        System.out.println("Welcome to the Bank of Money");

        do {
            System.out.println("==============================================");
            System.out.println("Please enter an option.");
            System.out.println("==============================================");
            System.out.println("1. Sign up for an account");
            System.out.println("2. Log in");
            System.out.println("3. Help Center - Question");
            System.out.println("4. Help Center - Complaint");
            System.out.println("5. Exit");
            System.out.println("==============================================");

            try {
                option = scanner.nextInt();

                switch (option) {
                    case 1:
                        scanner.nextLine();
                        System.out.println("Please enter your name:");
                        String userName = scanner.nextLine();
                        int userID = createAccount(userName);
                        System.out.println("Your ID is: " + userID);
                        break;

                    case 2:
                        System.out.println("Please enter your ID (else, enter '505' to log in with your name):");
                        int cid = scanner.nextInt();
                        BankAccount userAcc;
                        if (cid == 505) {
                            scanner.nextLine();
                            System.out.println("Please enter your name:");
                            String cname = scanner.nextLine();

                            try {
                                userAcc = logIn(cname);
                                System.out.println("You have logged in successfully!");
                                showAccountMenu(userAcc);
                            } catch (Exception e) {
                                System.out.println(e.getMessage());
                                System.out.println("\n");
                            }
                            break;
                        }
                        try {
                            userAcc = logIn(cid);
                            System.out.println("You have logged in successfully!");
                            showAccountMenu(userAcc);
                        } catch (Exception e) {
                            System.out.println(e.getMessage());
                            System.out.println("\n");
                        }
                        break;
                    case 5:
                        System.out.println("Have a nice Day! Goodbye :)");
                        loop = false;
                        break;
                    case 3:
                        scanner.nextLine();
                        System.out.println("Please enter your question:");
                        String question = scanner.nextLine();
                        CustomerQuestion customerQuestion = new CustomerQuestion(question);
                        HelpCenter.handleCustomerMessage(customerQuestion);
                        break;
                    case 4:
                        scanner.nextLine();
                        System.out.println("Please enter your complaint:");
                        String complaint = scanner.nextLine();
                        CustomerComplaint customerComplaint = new CustomerComplaint(complaint);
                        HelpCenter.handleCustomerMessage(customerComplaint);
                        break;
                    default:
                        System.out.println("Invalid option! Please enter again.");
                        break;
                }
            } catch (InputMismatchException e) {
                System.out.println("Invalid option! Please enter again.");
                // flushes the scanner
                scanner.next();
                System.out.println();
            }
        } while (loop);

    }

    public int createAccount(String customerName) {
        BankAccount acc = new BankAccount(customerName);
        customers.add(acc);
        return acc.getCustomerID();
    }

    private BankAccount logIn(int customerID) throws Exception {
        for (BankAccount account: customers) {
            if (account.getCustomerID() == customerID) {
                return account;
            }
        }
        throw new Exception("Sorry, it looks like you don't have an account with us! Invalid ID.");
    }

    private BankAccount logIn(String customerName) throws Exception {
        for (BankAccount account: customers) {
            if (account.getCustomerName().equals(customerName)) {
                return account;
            }
        }
        throw new Exception("Sorry, it looks like you don't have an account with us! Invalid name.");
    }

    private void showAccountMenu(BankAccount acc) {
        System.out.println("==============================================");
        System.out.println("Hello " + acc.getCustomerName() + "!");
        int accOption = 0;

        do {
            System.out.println("==============================================");
            System.out.println("Please select an option:");
            System.out.println("1. Check My Balance");
            System.out.println("2. Deposit");
            System.out.println("3. Withdraw");
            System.out.println("4. Log Out");
            System.out.println("==============================================");


            try {


                accOption = scanner.nextInt();

                switch (accOption) {
                    case 1:
                        System.out.println("--------------------------------------");
                        System.out.println("Your current balance is: $" + acc.getBalance());
                        System.out.println("--------------------------------------");
                        break;

                    case 2:
                        System.out.println("--------------------------------------");
                        System.out.println("Please enter the amount to deposit:");
                        System.out.println("--------------------------------------");
                        int depositAmt = scanner.nextInt();
                        acc.deposit(depositAmt);
                        break;

                    case 3:
                        System.out.println("--------------------------------------");
                        System.out.println("Please enter the amount to withdraw:");
                        System.out.println("--------------------------------------");
                        int withdrawAmt = scanner.nextInt();
                        acc.withdraw(withdrawAmt);
                        break;

                    case 4:
                        break;

                    default:
                        System.out.println("Invalid option! Please enter again.");
                        break;
                }
            } catch (InputMismatchException e) {
                System.out.println("Invalid option! Please enter again.");
                // flushes the scanner
                scanner.next();
                System.out.println();
            }
        } while (accOption != 4);
        System.out.println("You have logged out successfully.");


    }
}
