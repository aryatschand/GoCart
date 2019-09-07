//
//  ShoppingList.swift
//  Simple Shopping
//
//  Created by Arya Tschand on 9/6/19.
//  Copyright © 2019 HTHS. All rights reserved.
//

import Foundation

class ShoppingList: Codable {
    var name: String = ""
    var names: [String] = []
    var price: [Double] = []
    var url: [String] = []
}
