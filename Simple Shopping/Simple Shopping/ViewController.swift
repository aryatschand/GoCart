//
//  SerialViewController.swift
//  HM10 Serial
//
//  ViewController.swift
//  Simple Shopping
//
//  Created by Arya Tschand on 8/25/19.
//  Copyright © 2019 HTHS. All rights reserved.
//

import UIKit
import CoreBluetooth
import QuartzCore
import Firebase
import CryptoSwift

/// The option to add a \n or \r or \r\n to the end of the send message
enum MessageOption: Int {
    case noLineEnding,
    newline,
    carriageReturn,
    carriageReturnAndNewline
}

/// The option to add a \n to the end of the received message (to make it more readable)
enum ReceivedMessageOption: Int {
    case none,
    newline
}

final class ViewController: UIViewController, UITextFieldDelegate, BluetoothSerialDelegate {
    
    //MARK: IBOutlets
    
    //@IBOutlet weak var mainTextView: UITextView!
    
    @IBOutlet weak var navItem: UINavigationItem!
    
    @IBOutlet weak var barButton: UIBarButtonItem!
    
    
    var dataArray = [SavedData]()
    var data: SavedData!
    let dataFilePath = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask).first?.appendingPathComponent("Data.plist")
    var ref: DatabaseReference!
    
    //MARK: Functions
    
    override func viewDidLoad() {
        super.viewDidLoad()
        ref = Database.database().reference()
        
        serial = BluetoothSerial(delegate: self)

        // UI
        //mainTextView.text = ""
        reloadView()
        
        NotificationCenter.default.addObserver(self, selector: #selector(ViewController.reloadView), name: NSNotification.Name(rawValue: "reloadStartViewController"), object: nil)
        
        // we want to be notified when the keyboard is shown (so we can move the textField up)
        NotificationCenter.default.addObserver(self, selector: #selector(ViewController.keyboardWillShow(_:)), name: UIResponder.keyboardWillShowNotification, object: nil)
        NotificationCenter.default.addObserver(self, selector: #selector(ViewController.keyboardWillHide(_:)), name: UIResponder.keyboardWillHideNotification, object: nil)
        
        // we want to be notified when the keyboard is shown (so we can move the textField up)
        
        // to dismiss the keyboard if the user taps outside the textField while editing
        
        // style the bottom UIView
    }
    
    override func viewWillAppear(_ animated: Bool) {
    }
    
    deinit {
        NotificationCenter.default.removeObserver(self)
    }
    
    @objc func keyboardWillShow(_ notification: Notification) {
        // animate the text field to stay above the keyboard
        var info = (notification as NSNotification).userInfo!
        let value = info[UIResponder.keyboardFrameEndUserInfoKey] as! NSValue
        let keyboardFrame = value.cgRectValue
        
        //TODO: Not animating properly
        UIView.animate(withDuration: 1, delay: 0, options: UIView.AnimationOptions(), animations: { () -> Void in
        }, completion: { Bool -> Void in
            self.textViewScrollToBottom()
        })
    }
    
    @objc func keyboardWillHide(_ notification: Notification) {
        // bring the text field back down..
        UIView.animate(withDuration: 1, delay: 0, options: UIView.AnimationOptions(), animations: { () -> Void in
        }, completion: nil)
        
    }
    
    func sendName(inputtemp : String) {
            var input = inputtemp
            var index: Int = -1
            for var x in 0...data.idArray.count-1 {
                var testStr = String(data.idArray[x]) + "\r\n"
                if testStr == input {
                    index = x
                    break
                }
            }
        if index != -1 {
            serial.sendMessageToDevice(data.nameArray[index])
            serial.sendMessageToDevice(",")
            serial.sendMessageToDevice(String(data.priceArray[index]))
            print("sent")
        }
    }
    
    @objc func reloadView() {
        // in case we're the visible view again
        serial.delegate = self
        
        if serial.isReady {
            navItem.title = serial.connectedPeripheral!.name
            barButton.title = "Disconnect"
            barButton.tintColor = UIColor.red
            barButton.isEnabled = true
        } else if serial.centralManager.state == .poweredOn {
            navItem.title = "Bluetooth Serial"
            barButton.title = "Connect"
            barButton.tintColor = view.tintColor
            barButton.isEnabled = true
        } else {
            navItem.title = "Bluetooth Serial"
            barButton.title = "Connect"
            barButton.tintColor = view.tintColor
            barButton.isEnabled = false
        }
    }
    
    func textViewScrollToBottom() {
        //let range = NSMakeRange(NSString(string: mainTextView.text).length - 1, 1)
        //mainTextView.scrollRangeToVisible(range)
    }
    
    
    //MARK: BluetoothSerialDelegate
    
    func serialDidReceiveString(_ message: String) {
        // add the received text to the textView, optionally with a line break at the end
        //mainTextView.text! += message
        sendName(inputtemp: message)
        let pref = UserDefaults.standard.integer(forKey: ReceivedMessageOptionKey)
        //if pref == ReceivedMessageOption.newline.rawValue { mainTextView.text! += "\n" }
        textViewScrollToBottom()
    }
    
    func serialDidDisconnect(_ peripheral: CBPeripheral, error: NSError?) {
        reloadView()
        let hud = MBProgressHUD.showAdded(to: view, animated: true)
        hud?.mode = MBProgressHUDMode.text
        hud?.labelText = "Disconnected"
        hud?.hide(true, afterDelay: 1.0)
    }
    
    func serialDidChangeState() {
        reloadView()
        if serial.centralManager.state != .poweredOn {
            let hud = MBProgressHUD.showAdded(to: view, animated: true)
            hud?.mode = MBProgressHUDMode.text
            hud?.labelText = "Bluetooth turned off"
            hud?.hide(true, afterDelay: 1.0)
        }
    }
    
    
    //MARK: UITextFieldDelegate
    
    
    //MARK: IBActions
    
    @IBAction func barButtonPressed(_ sender: AnyObject) {
        if serial.connectedPeripheral == nil {
            performSegue(withIdentifier: "ShowScanner", sender: self)
        } else {
            serial.disconnect()
            reloadView()
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
}
extension String {
    var isInt: Bool {
        return Int(self) != nil
    }
}
        

