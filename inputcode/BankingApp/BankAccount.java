package BankingApp;

public class BankAccount {
    private int balance;
    private final int customerID;
    private final String customerName;

    public BankAccount(String customerName) {
        this.customerName = customerName;
        balance = 0;
        customerID = (int) (10000 + Math.random() * 99999);
    }

    public void deposit(int amt) {
        if (amt > 0) {
            balance = balance + amt;
            System.out.println("You have deposited: $" + amt);
            System.out.println("Your new balance: $" + balance);
        }
    }

    public void withdraw(int amt) {
        if (amt > balance) {
            System.out.println("You do not have sufficient funds!");
        } else {
            balance = balance - amt;
            System.out.println("You have withdrawn: $" + amt);
            System.out.println("Your remaining balance: $" + balance);
        }
    }

    public String getCustomerName() {
        return customerName;
    }

    public int getCustomerID() {
        return customerID;
    }

    public int getBalance() {
        try {
            Thread.sleep(4000);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return balance;
    }

}
