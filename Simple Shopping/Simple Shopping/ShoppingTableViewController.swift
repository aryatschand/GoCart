//
//  ShoppingTableViewController.swift
//  Simple Shopping
//
//  Created by Arya Tschand on 9/6/19.
//  Copyright © 2019 HTHS. All rights reserved.
//

import UIKit

class ShoppingTableViewController: UITableViewController {

    var dataArray = [SavedData]()
    var data: SavedData!
    let dataFilePath = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask).first?.appendingPathComponent("Data.plist")
    var select = 0
    var displayArray: [String] = []
    var index = -1
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
    }
    
    override func viewWillAppear(_ animated: Bool) {
        print (index)
        loadData()
        saveData()
        data = dataArray[0]
        displayArray = []
        for var x in 0...data.lists.count-1  {
            displayArray.append(data.lists[x].name)
        }
        displayArray.append("none")
        tableView.reloadData()
    }
    
    override func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return data.lists.count+1
    }
    
    // Populate rows and delete a player if the information is incomplete
    override func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: "product", for: indexPath)
        cell.textLabel?.text = displayArray[indexPath.row]
        return cell
    }
    
    override func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath)
    {
        tableView.deselectRow(at: indexPath, animated: true)
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
