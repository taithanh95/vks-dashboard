import {Component} from '@angular/core';
import {NzTreeFlatDataSource, NzTreeFlattener, NzTreeViewModule} from 'ng-zorro-antd/tree-view';
import {NzSelectModule} from 'ng-zorro-antd/select';
import {ConstantService} from '../../../common/constant/constant.service';
import {CookieService} from 'ngx-cookie-service';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {SelectionModel} from '@angular/cdk/collections';
import {FlatTreeControl} from '@angular/cdk/tree';

interface TreeNode {
  parentid?: string;
  groupid?: string;
  funcname?: string;
  funcid?: string;
  selected?: boolean;
  disabled?: boolean;
  parent?: TreeNode;
  children?: TreeNode[];
}

interface FlatNode {
  expandable: boolean;
  funcname: string;
  groupid: string;
  level: number;
  disabled: boolean;
}

@Component({
  selector: 'app-adm-grant-group',
  templateUrl: './adm-grant-group.component.html',
  styleUrls: ['./adm-grant-group.component.css'],
  providers: [
    NzTreeViewModule,
    NzSelectModule
  ]
})
export class AdmGrantGroupComponent {

  dataState: any;
  module = '';
  arrCollapse: boolean[] = [true, true];
  userid = this.cookieService.get(this.constantService.USERNAME);
  isLoading: boolean = false;

  constructor(
    private constantService: ConstantService,
    private cookieService: CookieService,
    private router: Router,
    private toastrService: ToastrService
  ) {
    this.dataState = this.router.getCurrentNavigation().extras.state;
    if (!this.dataState) {
      this.goToBack();
    }
    this.getFunctionsTree();
  }

  // BEGIN TREE NODE
  private transformer = (node: TreeNode, level: number): FlatNode => {
    const existingNode = this.nestedNodeMap.get(node);
    const flatNode =
      existingNode && existingNode.funcname === node.funcname
        ? existingNode
        : {
          expandable: !!node.children && node.children.length > 0,
          funcname: node.funcname,
          level,
          disabled: !!node.disabled,
          groupid: node?.groupid
        };
    this.flatNodeMap.set(flatNode, node);
    this.nestedNodeMap.set(node, flatNode);
    return flatNode;
  };
  flatNodeMap = new Map<FlatNode, TreeNode>();
  nestedNodeMap = new Map<TreeNode, FlatNode>();
  checklistSelection = new SelectionModel<FlatNode>(true);

  treeControl = new FlatTreeControl<FlatNode>(
    node => node.level,
    node => node.expandable
  );

  treeFlattener = new NzTreeFlattener(
    this.transformer,
    node => node.level,
    node => node.expandable,
    node => node.children
  );

  dataSource = new NzTreeFlatDataSource(this.treeControl, this.treeFlattener);

  hasChild = (_: number, node: FlatNode): boolean => node.expandable;

  descendantsAllSelected(node: FlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    return descendants.length > 0 && descendants.every(child => this.checklistSelection.isSelected(child));
  }

  descendantsPartiallySelected(node: FlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const result = descendants.some(child => this.checklistSelection.isSelected(child));
    return result && !this.descendantsAllSelected(node);
  }

  leafItemSelectionToggle(node: FlatNode): void {
    this.checklistSelection.toggle(node);
    this.checkAllParentsSelection(node);
  }

  itemSelectionToggle(node: FlatNode): void {
    this.checklistSelection.toggle(node);
    const descendants = this.treeControl.getDescendants(node);
    this.checklistSelection.isSelected(node)
      ? this.checklistSelection.select(...descendants)
      : this.checklistSelection.deselect(...descendants);

    descendants.forEach(child => this.checklistSelection.isSelected(child));
    this.checkAllParentsSelection(node);
  }

  checkAllParentsSelection(node: FlatNode): void {
    let parent: FlatNode | null = this.getParentNode(node);
    while (parent) {
      this.checkRootNodeSelection(parent);
      parent = this.getParentNode(parent);
    }
  }

  checkRootNodeSelection(node: FlatNode): void {
    const nodeSelected = this.checklistSelection.isSelected(node);
    const descendants = this.treeControl.getDescendants(node);
    const descAllSelected =
      descendants.length > 0 && descendants.every(child => this.checklistSelection.isSelected(child));
    if (nodeSelected && !descAllSelected) {
      this.checklistSelection.deselect(node);
    } else if (!nodeSelected && descAllSelected) {
      this.checklistSelection.select(node);
    }
  }

  getParentNode(node: FlatNode): FlatNode | null {
    const currentLevel = node.level;

    if (currentLevel < 1) {
      return null;
    }

    const startIndex = this.treeControl.dataNodes.indexOf(node) - 1;

    for (let i = startIndex; i >= 0; i--) {
      const currentNode = this.treeControl.dataNodes[i];

      if (currentNode.level < currentLevel) {
        return currentNode;
      }
    }
    return null;
  }

  // END TREE NODE

  handleOk() {
    setTimeout(() => {
      const lstFunc: TreeNode[] = [];
      this.dataSource._flattenedData.getValue().forEach(node => {
        if (this.checklistSelection.isSelected(node)) {
          const func = this.flatNodeMap.get(node);
          const dataFunc = {funcid: func.funcid, funcname: func.funcname};
          lstFunc.push(dataFunc);
        }
      });
      const payload = {
        ...this.dataState,
        // userid: this.cookieService.get(this.constantService.ID_SPP),
        lstFunc: lstFunc,
        module: this.module
      };
      this.isLoading = true;
      this.constantService.postRequest(this.constantService.QUAN_LY_AN + 'AdmGrant/saveGrantFnsToGroup', payload).subscribe(res => {
        if (!res) {
          this.toastrService.error(this.constantService.SYSTEM_ERROR);
        } else {
          this.toastrService.success('Phân quyền cho nhóm NSD thành công');
        }
        this.isLoading = false;
      }, err => this.toastrService.error('Có lỗi khi thực hiện: ' + err));
      this.isLoading = false;
    }, 100);
  }

  async getFunctionsTree() {
    this.getFuncTree();
  }

  getFuncTree() {
    this.constantService.get(`/dm/AdmGrant/getFnTreeForGroup?groupid=${this.dataState.groupid}&module=${this.module}`, null).subscribe(res => {
      if (res) {
        const datas: TreeNode[] = res;
        const functionsTree = datas.filter(res => res?.parentid === null);
        functionsTree.forEach((value, index, arr) => {
          const funcid = value.funcid;
          const children = datas.filter(res => res?.parentid == funcid);
          if (children) {
            arr[index].children = children;
          }
        });
        this.dataSource.setData(functionsTree.sort());
        this.setSelectionToggle();
      }
    });
  }

  setSelectionToggle() {
    this.dataSource._flattenedData.getValue().forEach(node => {
      if (node.groupid) {
        this.checklistSelection.select(node);
      }
    });
  }

  goToBack() {
    history.back();
  }
}
