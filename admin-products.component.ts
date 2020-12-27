import { DeleteProductComponent } from './../delete-product/delete-product.component';
import { AdminServiceService } from './../service/admin-service.service';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { AddProductComponent } from 'src/app/components/admin/add-product/add-product.component';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { Product } from './../../../models/product';
import { filter, map } from 'rxjs/operators';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-admin-products',
  templateUrl: './admin-products.component.html',
  styleUrls: ['./admin-products.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AdminProductsComponent implements OnInit {
  formAddProduct!: FormGroup;
  isLoading = false;
  displayedColumns: string[] = ['id', 'name', 'image', 'price', 'quantity', 'category', 'unit', 'actions'];
  products: Product[] = [];
  products$!: Observable<Product[]>;
  // products = new MatTableDataSource<Product>(this.ELEMENT_DATA);
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  filterTerm = '';
  isFilterOpen = false;
  constructor(private adminService: AdminServiceService, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.adminService.refreshNeeded$.subscribe(() => {
      this.getProducts();
    });
    this.getProducts();
  }

  onClear(): void {
    this.filterTerm = '';
  }
  onAddProduct() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    // dialogConfig.width = '60%';
    this.dialog.open(AddProductComponent, dialogConfig);
  }
  onEditProduct(id: number) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    let productsData;
    let productData: any;
    const product = this.adminService.products$.subscribe(
      (response: any) => {
        productsData = response.document;
        productsData.forEach((product: any) => {
          if (product.id === id) {
            console.log(product);
            productData = product;
            this.dialog.open(AddProductComponent, { data: productData });
          }

        });

      }

    );
  }

  getProducts(): void {
    this.isLoading = true;
    this.products$ = this.adminService.products$.pipe(
      map((response: any) => this.products = response.document,
        this.isLoading = false
      )
    );
  }
  onDeleteProduct(id: number): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    let productsData;
    let productData: any;
    const product = this.adminService.products$.subscribe(
      (response: any) => {
        productsData = response.document;
        productsData.forEach((product: any) => {
          if (product.id === id) {
            console.log(product);
            productData = product;
            this.dialog.open(DeleteProductComponent, { data: productData });
          }

        });

      }

    );
  }
  applyFilter(filterValue: string) {
    // this.products.filter = filterValue.trim().toLocaleLowerCase();
    // this.products = this.products.filter((product: Product) => {
    //   product.name?.toLocaleLowerCase().match(this.searchName.toLocaleLowerCase());
    //   console.log(product.name);

    // });
  }
}
