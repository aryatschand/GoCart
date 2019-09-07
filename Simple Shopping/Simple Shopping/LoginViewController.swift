//
//  LoginViewController.swift
//  Simple Shopping
//
//  Created by Arya Tschand on 9/1/19.
//  Copyright © 2019 HTHS. All rights reserved.
//

import UIKit
import Firebase
import CryptoSwift

class LoginViewController: UIViewController, UITextFieldDelegate {

    var dataArray = [SavedData]()
    var data: SavedData!
    let dataFilePath = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask).first?.appendingPathComponent("Data.plist")
    var ref: DatabaseReference!
    
    func loadArrays() {
        
        self.ref.child("Products").observeSingleEvent(of: .value, with: { (snapshot) in
            // Get user value
            self.data.nameArray = []
            self.data.idArray = []
            self.data.priceArray = []
            self.data.urlArray = []
            let value = snapshot.value as? NSDictionary
            for (key,values) in value! {
                self.data.nameArray.append(key as! String)
                self.ref.child("Products").child("\(key)").observeSingleEvent(of: .value, with: { (snapshot) in
                    let value2 = snapshot.value as? NSDictionary
                    self.data.idArray.append(value2?["id"] as! Int64)
                    self.data.priceArray.append(value2?["price"] as! Double)
                    self.data.urlArray.append(value2?["imageUrl"] as! String)
                    // init serial
                })
            }
            self.saveData()
        })
    }
    
    func textFieldShouldReturn(_ scoreText: UITextField) -> Bool {
        self.view.endEditing(true)
        return true
    }
    
    @IBOutlet weak var Username: UITextField!
    
    @IBOutlet weak var Password: UITextField!
    
    @IBAction func Enter(_ sender: Any) {
        if Username.text != "" && Password.text != "" {
            var password = Password.text!.sha512()
            ref.child("users").observeSingleEvent(of: .value, with: { (snapshot) in
                // Get user value
                let value = snapshot.value as? NSDictionary
                for (key,values) in value! {
                    self.ref.child("users").child("\(key)").observeSingleEvent(of: .value, with: { (snapshot) in
                        let value2 = snapshot.value as? NSDictionary
                        if (value2?["password"] as! String) == password && (value2?["username"] as! String) == self.Username.text {
                            self.data.loggedin = true
                            self.saveData()
                            print(self.data.loggedin)
                            self.performSegue(withIdentifier: "login", sender: self)
                        } else {
                            self.Username.text = ""
                            self.Password.text = ""
                        }
                    })
                }
            })
        }
    }
    
    override func viewDidLoad() {
        super.viewDidLoad()
        loadData()
        Password.delegate = self
        Username.delegate = self
        if dataArray.count == 0 {
            var dataSet = SavedData()
            dataArray.append(dataSet)
        }
        data = dataArray[0]
        ref = Database.database().reference()
        loadArrays()
        saveData()
    }
    
    override func viewDidAppear(_ animated: Bool) {
        if data.loggedin == true {
            self.performSegue(withIdentifier: "login", sender: self)
        }
    }
    
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        if segue.identifier == "signup" {
            var SignupViewController = segue.destination as! SignupViewController
            SignupViewController.data = data
        }
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
    
    // Standard load data function to retrieve information from saved file
    func loadData() {
        if let data = try? Data(contentsOf: dataFilePath!) {
            let decoder = PropertyListDecoder()
            do {
                dataArray = try decoder.decode([SavedData].self, from: data)
            } catch {
                let alert = UIAlertController(title: "Error Code 2", message: "Something went wrong! Please reload App.", preferredStyle: .alert)
                alert.addAction(UIAlertAction(title: "OK", style: .default))
                self.present(alert, animated: true)
            }
        }
    }
}

