
export type classNameProps={
    className?:string
    logout?:()=>void
}
export default function Topbar({className}:classNameProps) {
  return (
    <div className={className}>Topbar</div>
  )
}
