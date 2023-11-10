import inquirer from "inquirer";
import { faker } from "@faker-js/faker";
import chalk from "chalk";
// customer class
class Customer {
    constructor(fName, lName, age, gender, mobNumber, accNumber) {
        this.firstName = fName;
        this.lastName = lName;
        this.age = age;
        this.gender = gender;
        this.mobNumber = mobNumber;
        this.accNumber = accNumber;
    }
}
//class bank
class Bank {
    constructor() {
        this.customer = [];
        this.account = [];
    }
    addCustomer(obj) {
        this.customer.push(obj);
    }
    addAccountNumber(obj) {
        this.account.push(obj);
    }
    transaction(accobj) {
        let NewAccounts = this.account.filter((acc) => acc.accNumber !== accobj.accNumber);
        this.account = [...NewAccounts, accobj];
    }
}
let islamicBank = new Bank();
// customer creation
for (let i = 1; i <= 3; i++) {
    let fName = faker.person.firstName(`male`);
    let lName = faker.person.lastName(`male`);
    let num = parseInt(faker.phone.number("3#########"));
    const cus = new Customer(fName, lName, 25 * i, "male", num, 1000 + i);
    islamicBank.addCustomer(cus);
    islamicBank.addAccountNumber({ accNumber: cus.accNumber, balance: 13000 * i });
}
//bank functionality
async function bankService(bank) {
    do {
        let service = await inquirer.prompt({
            type: "list",
            name: "select",
            message: "Please Select the Service",
            choices: ["View Balance", "Cash Withdraw", "Cash Deposit"]
        });
        // view balance
        if (service.select == "View Balance") {
            let response = await inquirer.prompt({
                type: "input",
                name: "num",
                message: "Please Enter your Account Number:"
            });
            let account = islamicBank.account.find((acc) => acc.accNumber == response.num);
            if (!account) {
                console.log(chalk.red.bold.italic("Invalid Account Number"));
            }
            ;
            if (account) {
                let name = islamicBank.customer.find((item) => item.accNumber == account?.accNumber);
                console.log(`Dear ${chalk.green.italic(name?.firstName)} ${chalk.green.italic(name?.lastName)} Account Balance is ${chalk.bold.blue(`$ ${account.balance}`)}`);
            }
        }
        ;
        //cash withdrawal
        if (service.select == "Cash Withdraw") {
            let response = await inquirer.prompt({
                type: "input",
                name: "num",
                message: "Please Enter your Account Number:"
            });
            let account = islamicBank.account.find((acc) => acc.accNumber == response.num);
            if (!account) {
                console.log(chalk.red.bold("Invalid Account Number"));
            }
            if (account) {
                let ans = await inquirer.prompt({
                    type: "number",
                    message: "Please Enter your Amount",
                    name: "Rupee",
                });
                if (ans.Rupee > account.balance) {
                    console.log(chalk.red.bold("Insufficient Balance.."));
                }
                ;
                let newBalance = account.balance - ans.Rupee;
                //transaction method call
                bank.transaction({ accNumber: account.accNumber, balance: newBalance });
                //console.log(newBalance);
            }
        }
        ;
        // Cash Deposit
        if (service.select == "Cash Deposit") {
            let response = await inquirer.prompt({
                type: "input",
                name: "num",
                message: "Please Enter your Account Number:"
            });
            let account = islamicBank.account.find((acc) => acc.accNumber == response.num);
            if (!account) {
                console.log(chalk.red.bold("Invalid Account Number"));
            }
            if (account) {
                let ans = await inquirer.prompt({
                    type: "number",
                    message: "Please Enter your Amount",
                    name: "Rupee",
                });
                let newBalance = account.balance + ans.Rupee;
                //transaction method call
                bank.transaction({ accNumber: account.accNumber, balance: newBalance });
                //console.log(newBalance);
            }
        }
        ;
    } while (true);
}
;
bankService(islamicBank);
