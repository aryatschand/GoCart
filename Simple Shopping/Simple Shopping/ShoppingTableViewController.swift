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
    var index = -1
    var list: ShoppingList = ShoppingList()
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
    }
    
    override func viewWillAppear(_ animated: Bool) {
        loadData()
        saveData()
        data = dataArray[0]
        list.name = "Shopping List"
        print(index)
        if index >= 0 {
            for var x in 0...data.lists[index].names.count-1 {
                list.names.append(data.lists[index].names[x])
                list.url.append(data.lists[index].url[x])
                list.price.append(data.lists[index].price[x])
                list.quantity.append(data.lists[index].quantity[x])
            }
        }
        tableView.reloadData()
    }
    
    override func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return list.names.count
    }
    
    // Populate rows and delete a player if the information is incomplete
    override func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: "product", for: indexPath)
        
        if indexPath.row < list.url.count {
            let url = URL(string: list.url[indexPath.row])!
            let dataa = try? Data(contentsOf: url)
            if let imageData = dataa {
                let imagee = UIImage(data: imageData)
                cell.imageView?.image = imagee
            }
            cell.textLabel?.textAlignment = .left
            cell.textLabel?.text = list.names[indexPath.row] + " x" + list.quantity[indexPath.row] + " " + list.price[indexPath.row]
        }
        
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
