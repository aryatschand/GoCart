//
//  SignupViewController.swift
//  Simple Shopping
//
//  Created by Arya Tschand on 9/1/19.
//  Copyright © 2019 HTHS. All rights reserved.
//

import UIKit
import Firebase

class SignupViewController: UIViewController, UITextFieldDelegate {

    var dataArray = [SavedData]()
    var data: SavedData!
    let dataFilePath = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask).first?.appendingPathComponent("Data.plist")
    var ref: DatabaseReference!
    
    @IBOutlet weak var Username: UITextField!
    
    @IBOutlet weak var Password: UITextField!
    
    @IBOutlet weak var PasswordVerify: UITextField!
    
    
    @IBAction func Enter(_ sender: Any) {
        if Password.text == PasswordVerify.text {
            var username = Username.text
            var password = String(Password.text!.sha512())
            
            ref.child("users").childByAutoId().setValue(["username": username, "password": password])
            data.loggedin = true
            saveData()
            self.performSegue(withIdentifier: "aftersignup", sender: self)
        } else {
            PasswordVerify.text = ""
            Password.text = ""
        }
    }
    
    func textFieldShouldReturn(_ scoreText: UITextField) -> Bool {
        self.view.endEditing(true)
        return true
    }
    
    @IBAction func Login(_ sender: Any) {
    }
    
    
    override func viewDidLoad() {
        super.viewDidLoad()
        Password.delegate = self
        Username.delegate = self
        PasswordVerify.delegate = self
        ref = Database.database().reference()
        var username = Username.text
        var password = String(Password.text!.sha512())
    }
    
    func saveData() {
        let encoder = PropertyListEncoder()
        do {
            let data = try encoder.encode(dataArray)
            try data.write(to: dataFilePath!)
        } catch {
            let alert = UIAlertController(title: "Error Code 1", message: "Something went wrong! Please reload App.", preferredStyle: .alert)
            alert.addAction(UIAlertAction(title: "OK", style: .default))
            self.present(alert, animated: true)
        }
    }
}
